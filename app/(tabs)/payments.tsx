import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Signature from 'react-native-signature-canvas'; 

import { addEvent } from '@/scripts/eventsAPI'; 
import { createPaymentRecord } from '@/scripts/paymentRecordsAPI';

import { supabase } from '@/services/supabaseClient';


interface RecordPaymentsProps {
  // If you use navigation, pass props as neede
}


const RecordPayments: React.FC<RecordPaymentsProps> = () => {
  // 1) Form states
  const [storeNumber, setStoreNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split('T')[0]); 
  // store date as YYYY-MM-DD or however your DB expects

  // 2) Signature
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const signatureRef = useRef<any>(null);

  // 3) Loading / Error
  const [isLoading, setIsLoading] = useState(false);

  // 4) On mount, create an AUTO event
  useEffect(() => {
    (async () => {
      try {
        // You can choose any createdBy value. 
        // E.g., 'System' or the current user
        await addEvent('AUTO', new Date(), 'System');
        console.log('AUTO event created successfully');
      } catch (err: any) {
        console.error('Error creating AUTO event:', err);
        // Show an alert or handle error
      }
    })();
  }, []);

  /**
   * Callback when signature is saved from the signature pad
   * signature is a base64 encoded image (e.g., 'data:image/png;base64,iVBOR...')
   */
  const handleSignature = (signature: string) => {
    console.log('Signature captured!');
    setSignatureBase64(signature);
  };

  // If user taps 'Clear', we can reset the signature
  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
    setSignatureBase64(null);
  };

  /**
   * Upload the signature to Supabase Storage
   * Replace 'your-signatures-bucket' with your actual bucket name
   */
  const uploadSignatureToSupabase = async (base64Data: string): Promise<string> => {
    try {
      // 1) Convert base64 to a blob or to a file
      const base64WithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const fileName = `signature_${Date.now()}.png`;

      // Supabase requires a file (Blob in RN you can do a workaround)
      // For demonstration, let's convert base64 -> array buffer -> Blob
      const binaryString = atob(base64WithoutPrefix);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'image/png' });

      // 2) Upload to Supabase
      const { data, error } = await supabase.storage
        .from('your-signatures-bucket')
        .upload(fileName, blob, {
          contentType: 'image/png',
        });

      if (error) {
        throw error;
      }

      // 3) Construct the public URL to store in DB (or sign a URL)
      const { data: publicUrlData } = supabase.storage
        .from('your-signatures-bucket')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Unable to retrieve public URL for signature.');
      }

      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.error('Error uploading signature:', err);
      throw err;
    }
  };

  /**
   * Handle the final submission of the payment record
   */
  const handleSubmit = async () => {
    if (!storeNumber || !paymentAmount) {
      Alert.alert('Missing Fields', 'Please enter both a store number and payment amount.');
      return;
    }

    setIsLoading(true);

    try {
      // 1) If signature is present, upload it
      let signatureUrl = '';
      if (signatureBase64) {
        signatureUrl = await uploadSignatureToSupabase(signatureBase64);
      }

      // 2) Create payment record in DB
      const numericStoreNumber = parseInt(storeNumber, 10);
      const numericPaymentAmount = parseInt(paymentAmount, 10);

      // We'll store creation_date as a string for example
      const newRecord = {
        store_number: numericStoreNumber,
        payment_amount: numericPaymentAmount,
        signature: signatureUrl,
        creation_date: creationDate,  // or new Date().toISOString()
        additional_comments: additionalComments,
      };

      await createPaymentRecord(newRecord);
      Alert.alert('Success', 'Payment record created successfully!');
      // Clear fields
      setStoreNumber('');
      setPaymentAmount('');
      setAdditionalComments('');
      setSignatureBase64(null);

      // If desired, create another event or do other logic
      // The addEvent call in useEffect might suffice
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to create payment record.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        Record Payments
      </Text>

      <Text>Store Number</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 12,
          padding: 8,
        }}
        keyboardType="numeric"
        value={storeNumber}
        onChangeText={setStoreNumber}
      />

      <Text>Payment Amount</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 12,
          padding: 8,
        }}
        keyboardType="numeric"
        value={paymentAmount}
        onChangeText={setPaymentAmount}
      />

      <Text>Transaction Date</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 12,
          padding: 8,
        }}
        value={creationDate}
        onChangeText={setCreationDate}
      />

      <Text>Additional Comments</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 12,
          padding: 8,
        }}
        value={additionalComments}
        onChangeText={setAdditionalComments}
        multiline
      />

      <Text style={{ marginBottom: 6 }}>Signature</Text>
      {!signatureBase64 ? (
        // If no signature, show the signature pad
        <View style={{ height: 200, borderWidth: 1, borderColor: '#ccc', marginBottom: 12 }}>
          <Signature
            ref={signatureRef}
            onOK={handleSignature}
            onClear={handleClear}
            descriptionText="Sign here"
          />
        </View>
      ) : (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: 'green' }}>Signature captured!</Text>
          <TouchableOpacity onPress={handleClear} style={{ marginTop: 4 }}>
            <Text style={{ color: 'blue' }}>Clear Signature</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: 'green',
            padding: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RecordPayments;
