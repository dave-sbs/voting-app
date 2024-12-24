import React, { useState } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addNewCandidates } from '../scripts/manageActiveCandidates';
import CardHeader from './CardHeader';
import LineBreak from './LineBreak';

const CandidateForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('CandidateForm: render');

  const handleCandidateSubmit = async () => {
    console.log('CandidateForm: handleCandidateSubmit: start');
    try {
      if (!name || !image) {
        console.log('CandidateForm: handleCandidateSubmit: no name or image');
        if (!name) {
          console.log('CandidateForm: handleCandidateSubmit: no name');
          Alert.alert("Error", "Please enter a name");
        }
        if (!image) { 
          console.log('CandidateForm: handleCandidateSubmit: no image');
          Alert.alert("Error", "Please upload a picture");
        }
        return;
      }

      setIsLoading(true);

      console.log('CandidateForm: handleCandidateSubmit: calling addNewCandidates');
      const result = await addNewCandidates({
        memberName: name,
        imageFile: image
      });

      console.log('CandidateForm: handleCandidateSubmit: result:', result);

      if (result.error) {
        console.log('CandidateForm: handleCandidateSubmit: error:', result.error.message);
        Alert.alert("Error", result.error.message);
        return;
      }

      console.log('CandidateForm: handleCandidateSubmit: success');
      setName('');
      setImage(null);
      Alert.alert("Success", "Candidate added successfully!");
    } catch (error) {
      console.log('CandidateForm: handleCandidateSubmit: catch:', error);
      Alert.alert("Error", "Failed to add candidate");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    console.log('CandidateForm: pickImage: start');
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('CandidateForm: pickImage: permission denied');
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      console.log('CandidateForm: pickImage: permission granted');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        console.log('CandidateForm: pickImage: image picked');
        // Create a file object from the URI
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const imageFile = {
          uri,
          type: blob.type || 'image/jpeg',
          name: `candidate-${Date.now()}.${blob.type?.split('/')[1] || 'jpg'}`
        };
        
        setImage(imageFile);
      }
    } catch (error) {
      console.log('CandidateForm: pickImage: catch:', error);
      Alert.alert('Error', 'Failed to pick image');
      console.error(error);
    }
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Add New Candidate'} />
      <LineBreak />
      <View className='p-4'>
        <View className='flex-row items-center'>
          {image ? (
            <View className='w-[80px] h-[80px] rounded-full overflow-hidden'>
              <Image source={{ uri: image.uri }} style={{ width: 80, height: 80 }} />
            </View>
          ) : null}
          <Text className='text-xl font-bold pb-2 pl-4'>{name}</Text>
        </View>
        <View className='pt-12 relative'>
          <TextInput
            className='bg-gray-100 p-4 rounded-md'
            placeholder="Enter candidate name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.8}
          className='bg-blue-800 rounded-md h-[40px] justify-center items-center mt-4 mb-4'
        >
          <Text className='text-white font-bold'>
            {image ? 'Change Candidate Picture' : 'Upload Candidate Picture'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCandidateSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
          className={`bg-green-800 rounded-md h-[40px] w-[240px] justify-center items-center mb-4 ${
            isLoading ? 'opacity-50' : ''
          }`}
        >
          <Text className="text-white font-bold">
            {isLoading ? 'Adding Candidate...' : 'Add Candidate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CandidateForm;