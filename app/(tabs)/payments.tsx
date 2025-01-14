import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import Signature from 'react-native-signature-canvas'; 
import { supabase } from '../../services/supabaseClient.js';

import { insertNewEvent } from '../../scripts/eventsAPI';
import { createPaymentRecord } from '../../scripts/paymentRecordsAPI';

interface RecordPaymentsProps {}

const RecordPayments: React.FC<RecordPaymentsProps> = () => {
  const [storeNumber, setStoreNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [creationDate, setCreationDate] = useState(
    new Date().toISOString().split('T')[0]
  ); 

  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const signatureRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const showErrorModal = (err: any) => {
    const message = err?.message || String(err);
    console.error('[RecordPayments] Error:', err);
    setErrorModalMessage(message);
    setErrorModalVisible(true);
  };

  const uploadSignatureToSupabase = async (base64Data: string): Promise<string> => {
    try {
      const dataUri = base64Data.startsWith('data:image/')
        ? base64Data
        : `data:image/png;base64,${base64Data.replace(/^data:image\/\w+;base64,/, '')}`;

      const fileName = `signature_${Date.now()}_${storeNumber}.png`;
      const { data, error } = await supabase.storage
        .from('signature_bucket')
        .upload(fileName, dataUri, { contentType: 'image/png' });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('signature_bucket')
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

  const handleSignature = (signature: string) => {
    console.log('Signature captured (base64).');
    setSignatureBase64(signature);
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
    setSignatureBase64(null);
  };

  const handleSubmit = async () => {
    if (!storeNumber || !paymentAmount) {
      showErrorModal('Please enter both a store number and payment amount.');
      return;
    }
    setIsLoading(true);

    try {
      let signatureUrl = '';
      if (signatureBase64) {
        signatureUrl = await uploadSignatureToSupabase(signatureBase64);
      }

      const parsedPaymentAmount = parseFloat(paymentAmount);
      if (isNaN(parsedPaymentAmount)) {
        throw new Error('Invalid payment amount');
      }

      await createPaymentRecord({
        store_number: storeNumber,
        payment_amount: parsedPaymentAmount.toString(),
        signature: signatureUrl,
        creation_date: new Date().toISOString().split('T')[0],
        additional_comments: additionalComments,
      });

      await insertNewEvent('AUTO', new Date(), 'System');

      setErrorModalMessage('Payment record created successfully!');
      setErrorModalVisible(true);

      setStoreNumber('');
      setPaymentAmount('');
      setSignatureBase64(null);
      setAdditionalComments('');
    } catch (err: any) {
      showErrorModal(err);
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
        <View
          style={{
            height: 300,
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 12,
          }}
        >
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
          style={{ backgroundColor: 'green', padding: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={errorModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 16,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Notice
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={{ color: '#333' }}>{errorModalMessage}</Text>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
                padding: 10,
                alignItems: 'center',
                marginTop: 16,
                borderRadius: 4,
              }}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RecordPayments;
