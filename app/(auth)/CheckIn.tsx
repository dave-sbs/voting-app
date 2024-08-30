// src/screens/Auth/SignUp.tsx
import React, { useContext, useState } from 'react';
import { styled } from 'nativewind';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CandidatesContext } from '../(context)/CandidatesContext';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const CheckInScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { voters, setCurrVoter } = useContext(CandidatesContext)!; // Get the voters from CandidatesContext
  const [ storeId, setStoreId ] = useState('');


  const handleSubmit = () => {
    const newVoter = voters.find(voter => voter.id === storeId);

    if (storeId) {
      // If Voter ID already exists, set current voter and navigate to voter screen
      if (newVoter !== undefined) {
        setStoreId(storeId);
        setCurrVoter(storeId);
        navigation.navigate('(tabs)', { screen: 'voter' });
      } 
      // If Voter ID doesn't exist, show alert
      else if (!(newVoter !== undefined)){
        alert('Invalid credentials. Please check your Store Number and try again.');
      }
    } 
    // If Voter ID is empty, show alert
    else {
      alert('Please enter your Voter ID');
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
              className={`bg-green-800 py-3 px-2 rounded-md w-full justify-center items-center mt-4`}
          >
            <Text className='text-orange-500 font-bold text-lg'>Check In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckInScreen