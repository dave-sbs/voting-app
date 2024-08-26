// src/screens/Auth/SignUp.tsx
import React, { useContext, useState } from 'react';
import { styled } from 'nativewind';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CandidatesContext } from '../(context)/CandidatesContext';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const CheckInScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { voters, addVoter, setCurrVoter } = useContext(CandidatesContext)!; // Get the voters from CandidatesContext
  const [ voterId, setVoterId ] = useState('');


  const handleSubmit = () => {
    const numVoterId = Number(voterId);
    const newVoter = voters.find(voter => voter.id === numVoterId);
    console.log(newVoter !== undefined);

    if (numVoterId) {
      // If Voter ID already exists, set current voter and navigate to voter screen
      if (newVoter !== undefined) {
        setVoterId(voterId);
        setCurrVoter(numVoterId);
        navigation.navigate('(tabs)', { screen: 'voter' });
      } 
      // If Voter ID doesn't exist, add new voter and navigate to voter screen
      else if (!(newVoter !== undefined)){
        setVoterId(voterId);
        setCurrVoter(numVoterId);
        addVoter(numVoterId);
        navigation.navigate('(tabs)', { screen: 'voter' });
      } else {
        alert('Invalid credentials');
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
        <Text className='py-2 text-lg font-semibold'>Voter ID</Text>
          <TextInput
            placeholder="Enter Your Voter ID"
            placeholderTextColor="#a1a1a1"
            value={voterId}
            onChangeText={setVoterId}
            className="border border-gray-400 text-black py-3 px-2 w-full rounded-md"
          />
        
        <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              className={`bg-orange-400 py-3 px-2 rounded-md w-full justify-center items-center mt-4`}
          >
            <Text className='text-green-800 font-medium text-lg'>Check In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckInScreen