import React, { useState, useContext } from 'react';
import { TextInput, View } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';

import { CandidatesContext } from '@/app/(context)/CandidatesContext';

const CandidateForm = () => {
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('placeholder.png');
    const { addCandidate } = useContext(CandidatesContext)!;

    const handleSubmit = () => {
        if (name) {
            addCandidate(name, profilePic);
            setName('');
            setProfilePic('placeholder.png');
        }
    }


  return (
    <View className='p-4'>
        <TextInput 
            placeholder="Enter Full Name"
            value = {name}
            onChangeText = {setName}
            className = "border p-2 mb-4 rounded-md"
        />
        <PrimaryButton title="Add Candidate" handlePress={handleSubmit} color='bg-blue-500' isLoading={false} />
    </View>
    );
};

export default CandidateForm