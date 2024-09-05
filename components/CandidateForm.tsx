import React, { useState, useContext } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, Alert, ImageComponent } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';
import CardHeader from './CardHeader';
import LineBreak from './LineBreak';

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
      alert("Candidate added successfully!");
    }

    if (!name) {
      alert("Please enter a name");
    }

    if (!image) { 
      alert("Please upload a picture");
    }
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Add New Candidate'} />
      <View className={`${image ? 'display' : 'hidden' }`}>
        <View className='p-4 pt-6 flex-row items-baseline relative'>
          {image && (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                overflow: 'hidden',
              }}
            >
              <Image source={{ uri: image }} style={{ width: 80, height: 80 }} />
            </View>
          )}

          <Text className='text-xl font-bold pb-2 pl-4'>{name}</Text>
        </View>
        <View className='pt-12 relative'>
          <LineBreak />
        </View>
      </View>

      <View className='p-4 flex flex-row gap-6 items-center relative z-10'>
        <Text className='text-lg font-bold'>Full Name</Text>
        <TextInput
          placeholder="Enter Candidate's name"
          placeholderTextColor="gray"
          value={name}
          onChangeText={setName}
          className="border-0.5 rounded-md border-gray-400 text-black py-2 px-1 w-[240px]"
        />
      </View>

      <View className='w-full px-4 flex-row gap-20'>
        <TouchableOpacity 
          onPress={pickImage}
          activeOpacity={0.8}
          className={`bg-blue-600 p-1 rounded-md h-[40px] w-[200px] justify-center items-center`}
        >
          <Text className='text-white font-bold'>{image ? 'Change Candidate Picture' : 'Upload Candidate Picture'}</Text>
        </TouchableOpacity>
      <View className='items-center justify-center'>
        <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              className={`bg-green-800 rounded-md h-[40px] w-[240px] justify-center items-center mb-4`}
          >
          <Text className='text-orange-500 font-semibold text-lg'>
              Add Candidate
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default styled(CandidateForm);