import React, { useState, useContext } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, Alert, ImageComponent } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';

const CandidateForm = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const { addCandidate } = useContext(CandidatesContext)!;
  const [error, setError] = useState('');


  const pickImage = async () => {
    const { status } = await ImagePicker.
        requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
        Alert.alert(
            "Permission Denied",
            `Sorry, we need camera 
            roll permission to upload images.`
        );
    } else {
        const result =
            await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setError('');
        }
    }
  };


  const handleSubmit = () => {
    if (name && image) {
      addCandidate(name, image);
      setName('');
      setImage('');
    }

    if (!name) {
      alert("Please enter a name");
    }

    if (!image) { 
      alert("Please upload a picture");
    }
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Enter New Candidate</Text>
      <View className={`${image ? 'display' : 'hidden' } p-2 mb-4 border items-center justify-center rounded-md`}>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
      <TextInput
        placeholder="Enter Full Name"
        value={name}
        onChangeText={setName}
        className="border p-3 min-w-[50%] max-w-[70%] rounded-md"
      />
      <View className='w-full mt-1'>
        <TouchableOpacity 
          onPress={pickImage}
          activeOpacity={0.8}
          className={`${image ? 'bg-green-500' :'bg-gray-300'} p-1 rounded-md h-[40px] w-[120px] justify-center items-center`}
        >
          <Text className='font-medium'>{image ? 'Image Uploaded' : 'Upload Image'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            className={`bg-blue-500 p-1 rounded-md h-[40px] w-[160px] justify-center items-center mt-4`}
        >
            <Text className='text-white font-normal text-lg'>Add Candidate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default styled(CandidateForm);