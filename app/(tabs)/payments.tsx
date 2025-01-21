import React, { useRef, useState } from 'react';
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

import {
  uploadSignature,
  createPayment,
  createEvent
} from '@/scripts/paymentRecordsAPI'; // adjust the path to match your setup

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

  const style = `.m-signature-pad {box-shadow: none; border: none; }
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              `;

  const showErrorModal = (err: any) => {
    const message = err?.message || String(err);
    console.error('[RecordPayments] Error:', err);
    setErrorModalMessage(message);
    setErrorModalVisible(true);
  };

  const handleSignature = (signature: string) => {
    console.log('Signature captured (base64).');
    setSignatureBase64(signature);
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
    setSignatureBase64('');
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
        // Upload signature to Supabase
        signatureUrl = await uploadSignature(signatureBase64, storeNumber);
      }

      const parsedPaymentAmount = parseFloat(paymentAmount);
      if (isNaN(parsedPaymentAmount)) {
        throw new Error('Invalid payment amount');
      }

      // Create the payment record in your DB
      await createPayment(
        storeNumber,
        parsedPaymentAmount.toString(),
        signatureUrl,
        additionalComments
      );

      // Insert new event (if needed)
      await createEvent();

      setErrorModalMessage('Payment record created successfully!');
      setErrorModalVisible(true);

      // Reset form
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
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-2">
        Record Payments
      </Text>

      <Text className='text-lg font-medium mb-2'>Transaction Date</Text>
      <TextInput
        className="w-[500px] border-[1.75px] border-gray-300 rounded-md mb-3 text-lg pt-1 pb-4 px-2"
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#a1a1a1"
        value={creationDate}
        onChangeText={setCreationDate}
      />

      <Text className='text-lg font-medium mb-2'>Store Number *</Text>
      <TextInput
        className="w-[500px] border-[1.75px] border-gray-300 rounded-md mb-3 text-lg pt-1 pb-4 px-2"
        placeholder='Enter Store Number'
        placeholderTextColor="#a1a1a1"
        keyboardType="numeric"
        value={storeNumber}
        onChangeText={setStoreNumber}
      />

      <Text className='text-lg font-medium mb-2'>Payment Amount *</Text>
      <TextInput
        className="w-[500px] border-[1.75px] border-gray-300 rounded-md mb-3 text-lg pt-1 pb-4 px-2"
        placeholder='Enter Payment Amount'
        placeholderTextColor="#a1a1a1"
        keyboardType="numeric"
        value={paymentAmount}
        onChangeText={setPaymentAmount}
      />

      <Text className='text-lg font-medium mb-2'>Additional Comments</Text>
      <TextInput
        className="w-[750px] border-[1.75px] border-gray-300 rounded-md mb-3 text-lg pt-1 pb-4 px-2"
        placeholder='Enter Additional Comments'
        placeholderTextColor="#a1a1a1"
        value={additionalComments}
        onChangeText={setAdditionalComments}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        style={{ height: 'auto', minHeight: 100 }}
      />

      <Text className='text-lg font-medium mb-2'>Signature *</Text>

        <View className="border-[1.75px] border-gray-300 rounded-md bg-white w-full h-[400px] mb-4">
         <Signature
            ref={signatureRef}
            descriptionText="Sign here"
            webStyle={style}
          />
        </View>

        <TouchableOpacity 
        onPress={handleClear}
        className='mb-4 p-4 bg-blue-600 rounded-md w-[150px]'
        >
            <Text className='text-white font-bold'>Clear Signature</Text>
        </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-500 p-3 items-center"
        >
          <Text className="text-white font-bold">Submit</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={errorModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center">
          <View className="m-5 bg-white rounded-lg p-4 shadow-md">
            <Text className="text-lg font-bold mb-2.5">
              Notice
            </Text>
            <ScrollView className="max-h-[300px]">
              <Text className="text-gray-700">{errorModalMessage}</Text>
            </ScrollView>
            <TouchableOpacity
              className="bg-green-500 p-2.5 items-center mt-4 rounded"
              onPress={() => setErrorModalVisible(false)}
            >
              <Text className="text-white font-bold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RecordPayments;
