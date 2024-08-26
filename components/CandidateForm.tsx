import React, { useState, useContext } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, Alert, ImageComponent } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';
import CardHeader from './CardHeader';
import SecondaryButton from './SecondaryButton';
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
    }

    if (!name) {
      alert("Please enter a name");
    }

    if (!image) { 
      alert("Please upload a picture");
    }
  };

  return (
    <View className="bg-white w-full">
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
        <View className='pt-10 relative'>
          <LineBreak />
        </View>
      </View>

      <View className='p-4 flex-row gap-6 items-center'>
        <Text className='text-lg font-bold'>Full Name</Text>
        <TextInput
          placeholder=""
          value={name}
          onChangeText={setName}
          className="border-b-0.5 border-gray-400 text-black py-1 px-1 w-[200px]"
        />
      </View>

      <View className='w-full mt-1 px-4'>
        <TouchableOpacity 
          onPress={pickImage}
          activeOpacity={0.8}
          className={`bg-blue-600 p-1 rounded-md h-[40px] w-[200px] justify-center items-center`}
        >
          <Text className='text-white font-bold'>{image ? 'Change Candidate Picture' : 'Upload Candidate Picture'}</Text>
        </TouchableOpacity>
      
      <SecondaryButton title="Add Candidate" handlePress={handleSubmit} />
      </View>
    </View>
  );
};

export default styled(CandidateForm);