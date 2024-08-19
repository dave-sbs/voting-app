import React, { useState, useContext } from 'react';
import { View, TextInput, Button } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';

const CandidateForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('placeholder.png');
  const { addCandidate } = useContext(CandidatesContext)!;

  const handleSubmit = () => {
    if (name) {
      addCandidate(name, image);
      setName('');
      setImage('placeholder.png');
    }
  };

  return (
    <View className="p-4">
      <TextInput
        placeholder="Enter Full Name"
        value={name}
        onChangeText={setName}
        className="border p-2 mb-4"
      />
      <Button title="Add Candidate" onPress={handleSubmit} />
    </View>
  );
};

export default styled(CandidateForm);