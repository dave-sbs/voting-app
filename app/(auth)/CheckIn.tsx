import React, { useState, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { useVotingContext } from '../(context)/VotingContext';
import { convertStoreNumbertoId, isBoardMember } from '@/scripts/checkInAPI';
import { useEventContext } from '../(context)/EventContext';

const CheckInScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  
  const { 
    error, 
    isLoading,
    voter, 
    checkInVoter,  } = useVotingContext();

  const {
    events,
    fetchOpenEvents,
  } = useEventContext();
  
  const [storeId, setStoreId] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [ openEvents ] = useState(events);

  const showErrorModal = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalVisible(true);
  };

  // Show error modal if there's an error from context
  useEffect(() => {
    try{
      fetchOpenEvents();
    } catch (err : any) {
      console.error('Failed to fetch open events:', err);
      showErrorModal('There are no open meetings available. Please create a new meeting');
    }
  }, []);

  /*
  Will need extra logic to check if event is open.
  */ 
  const handleSubmit = async () => {
      let memberId: string | null;

      if (storeId) {
        setStoreId(storeId);
      }

      try {
        // Use the store number to get the member ID
        // Ensure member ID exists
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
          if (!openEvents) {
              showErrorModal('There are no open meetings available. Please create a new meeting');
              return;
          } else {
            // If it is a board meeting, ensure the voter is a board member
            const isBoardMeeting = openEvents[0].event_name === 'BOARD-MEETING';
            const isBoard = await isBoardMember(memberId);

            if (isBoardMeeting && isBoard) {
              await checkInVoter({ member_id: memberId, event_id: openEvents[0].event_id });
              navigation.navigate('(tabs)', { screen: 'voter' });
              return;
            }
            await checkInVoter({ member_id: memberId, event_id: openEvents[0].event_id });
            if (storeId) {
              setStoreId(storeId);
            }
            navigation.navigate('(tabs)', { screen: 'voter' });
          }
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