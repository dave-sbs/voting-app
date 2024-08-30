import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import CardHeader from './CardHeader';

  /**
   * A form to add a new voter. The form includes two input fields for the
   * voter's name and ID. When the form is submitted, the component checks if
   * a voter with the given ID already exists. If it does, an alert is shown.
   * If not, the new voter is added to the state and storage.
   *
   * @returns A JSX element representing the form.
   */
const VoterForm = () => {
  const [voterName, setVoterNameState] = useState('');
  const [storeId, setStoreId] = useState('');
  const { voters, addVoter } = useContext(CandidatesContext)!;

  const handleSubmit = () => {
    // Add new voter
    if (voterName && storeId) {
        // const numVoterId = Number(storeId);
        const newVoter = voters.find(voter => voter.id === storeId);

        // If Voter ID already exists, show alert
        if (newVoter !== undefined) {
            alert("Voter already exists!");
            return;
        } 
        // If Voter ID doesn't exist, add new voter
        else {
            addVoter(voterName, storeId);
            setVoterNameState('');
            setStoreId('');
            alert("Voter added successfully!");
        }
    }

    if (!voterName) {
      alert("Please enter the Voter Name");
    }

    if (!storeId) { 
      alert("Please enter the Voter Id");
    }
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Add New Voter'} />
      <View className='px-4 py-4 flex-row gap-[104px] items-center'>
        <Text className='text-lg font-bold'>Store ID</Text>
        <TextInput
            placeholder="Enter Store ID"
            placeholderTextColor="#a1a1a1"
            value={storeId}
            onChangeText={setStoreId}
            className="border-0.5 rounded-md border-gray-400 text-black py-2 px-1 w-[240px]"
          />
      </View>

      <View className='px-4 py-1 flex-row gap-6 items-center mb-2'>
        <Text className='text-lg font-bold'>Franchisee Name</Text>
        <TextInput
            placeholder='Enter Franchisee Name'
            placeholderTextColor="#a1a1a1"
            value={voterName}
            onChangeText={setVoterNameState}
            className="border-0.5 rounded-md border-gray-400 text-black py-2 px-1 w-[240px]"
          />
      </View>

       
      <View className='items-center justify-center'>
        <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              className={`bg-green-800 p-1 rounded-md h-[40px] w-[240px] justify-center items-center mt-1 mb-4`}
          >
          <Text className='text-orange-500 font-semibold text-lg'>
              Add Voter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default styled(VoterForm);