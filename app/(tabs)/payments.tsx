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
} from '@/scripts/API/paymentRecordsAPI'; // adjust the path to match your setup
import CardHeader from '@/components/CardHeader';

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

  const style = `.m-signature-pad {box-shadow: none; width: 100%; height: 100%; margin: 0px; border-radius: 0px;}
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
    <View className='flex-1 bg-white'>
      <CardHeader title="Record Payments" />
      <View className="flex-col gap-4 p-4">
        <View>
          <Text className='text-lg font-medium mb-2'>Transaction Date</Text>
          <TextInput
            className="border-[1.25px] rounded-md border-gray-200 p-3 w-[400px] text-green-800 font-semibold"
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#6b7280"
            value={creationDate}
            onChangeText={setCreationDate}
          />
        </View>

        <View>
          <Text className='text-lg font-medium mb-2'>Store Number *</Text>
          <TextInput
            className="border-[1.25px] rounded-md border-gray-200 text-black p-3 w-[400px]"
            placeholder='Enter Store Number'
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={storeNumber}
            onChangeText={setStoreNumber}
          />
        </View>

        <View>
          <Text className='text-lg font-medium mb-2'>Payment Amount *</Text>
          <TextInput
            className="border-[1.25px] rounded-md border-gray-200 text-black p-3 w-[400px]"
            placeholder='Enter Payment Amount'
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
          />
        </View>

        <View>
          <Text className='text-lg font-medium mb-2'>Additional Comments</Text>
          <TextInput
            className="border-[1.25px] rounded-md border-gray-200 text-black p-3 w-[600px]"
            placeholder='Enter Additional Comments'
            placeholderTextColor="#6b7280"
            value={additionalComments}
            onChangeText={setAdditionalComments}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={{ height: 'auto', minHeight: 100 }}
          />
        </View>

        <View>
          <Text className='text-lg font-medium mb-2'>Signature *</Text>
            <View className="border-[0.25px] border-gray-200 rounded-md w-full h-[300px] mb-2">
            <Signature
                ref={signatureRef}
                descriptionText="Sign here"
                webStyle={style}
              />
            </View>

            <TouchableOpacity 
            onPress={handleClear}
            className='mb-6 p-2 px-4 items-center bg-gray-200 rounded-md w-[200px] border-[1.25px] border-gray-700'>
                <Text className='text-gray-800 text-lg font-semibold'>Clear Signature</Text>
            </TouchableOpacity>
          </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#475569" />
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-800 py-3 items-center rounded-md"
          >
            <Text className="text-orange-500 text-xl font-semibold">Submit</Text>
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
    </View>
  );
};

export default RecordPayments;
