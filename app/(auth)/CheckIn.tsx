import React, { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { useVotingContext } from '../(context)/VotingContext';
import { convertStoreNumbertoId } from '@/scripts/checkInAPI';

const CheckInScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  
  const { 
    error, 
    isLoading,
    voter, 
    checkInVoter,  } = useVotingContext();
  
  const [storeId, setStoreId] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalVisible(true);
  };

  /*
  Will need extra logic to check if event is open.
  */ 
  const handleSubmit = async () => {
      let memberId: string | null;
      try {
          memberId = await convertStoreNumbertoId(storeId);
          if (memberId === null) {
              showErrorModal('Store number not found.');
              return;
          }
      } catch (err) {
          showErrorModal('Invalid credentials. Please check your Store Number and try again.');
          return;
      }
  
      try {
          await checkInVoter({ member_id: memberId, event_id: '8d44deea-8d13-49a9-85df-910489ce78e9' });
          setStoreId(storeId);
          navigation.navigate('(tabs)', { screen: 'voter' });
      } catch (err: any) {
          showErrorModal(err || 'Check-in failed. Please try again.');
      }
  };

  return (
    <View className="bg-white flex-1 items-center justify-center p-4">
      <View className='w-1/2 p-8 border border-gray-300 items-start rounded-md'>
        <Text className="text-3xl font-semibold mb-4">Check In</Text>
        <Text className='py-2 text-lg font-semibold'>Store Number</Text>
        <TextInput
          placeholder="Enter Your Store Number"
          placeholderTextColor="#a1a1a1"
          value={storeId}
          onChangeText={setStoreId}
          className="border border-gray-400 text-black py-3 px-2 w-full rounded-md"
        />
        
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isLoading}
          className={`bg-green-800 py-3 px-2 rounded-md w-full justify-center items-center mt-4 ${isLoading ? 'opacity-50' : ''}`}
        >
          <Text className='text-orange-500 font-bold text-lg'>{isLoading ? 'Checking In...' : 'Check In'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isErrorModalVisible}
        onRequestClose={() => setIsErrorModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white bg-opacity-80 p-5 rounded-md justify-center items-center w-3/5">
            <Text className="text-xl text-orange-500 font-bold mb-3">Error</Text>
            <Text className="mb-4 text-lg font-semibold text-black">{errorMessage}</Text>
            <TouchableOpacity
              onPress={() => setIsErrorModalVisible(false)}
              className="bg-green-800 py-2 px-4 rounded-md self-end"
            >
              <Text className="text-orange-400 font-bold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckInScreen;