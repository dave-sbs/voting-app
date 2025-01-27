import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import CardHeader from './CardHeader';
import LineBreak from './LineBreak';

import { useCandidateContext } from '@/app/(context)/CandidateContext';

interface ImageFile {
  uri: string;
  type: string;
  name: string;
}

const CandidateForm = () => {
  const {
    candidates,
    isLoading,
    error,
    fetchCandidates,
    addCandidate,
  } = useCandidateContext();

  const [name, setName] = useState('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (error) {
      console.error('Context Error:', error);
      showModal(error);
    }
  }, [error]);

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleCandidateSubmit = async () => {
    if (!name || !image) {
      if (!name) {
        showModal('Please enter a name');
      }
      if (!image) {
        showModal('Please upload a picture');
      }
      return;
    }

    try {
      await addCandidate({
        id: '',
        name: name,
        profile_picture: image.uri,
        vote_count: 0
      });

      setName('');
      setImage(null);
      fetchCandidates();
      showModal('Candidate added successfully!');
    } catch (err: any) {
      showModal(err.message);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Camera roll permission denied');
      showModal('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageFile: ImageFile = {
        uri,
        type: blob.type || 'image/jpeg',
        name: `candidate-${Date.now()}.${blob.type?.split('/')[1] || 'jpg'}`,
      };

      console.log('Image picked:', imageFile);
      setImage(imageFile);
    } else {
      console.log('Image picking cancelled');
    }
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title="Add New Candidate" />
      <LineBreak />
      <View className="p-4">
        <View className="flex-row items-center">
          {image && (
            <View className="w-[80px] h-[80px] rounded-full overflow-hidden">
              <Image source={{ uri: image.uri }} style={{ width: 80, height: 80 }} />
            </View>
          )}
          <Text className="text-xl font-bold pb-2 pl-4">{name}</Text>
        </View>

        <View className={`relative ${name ? 'pt-12' : 'pt-2'}`}>
          <TextInput
            className="bg-gray-50 w-[50%] border-[1.75px] border-gray-300 rounded-md text-lg pt-3 mb-1 px-2 pb-3 items-center justify-center"
            placeholder="Enter candidate name"
            placeholderTextColor="#a1a1a1"
            value={name}
            onChangeText={(text) => {
              console.log('Name changed:', text);
              setName(text);
            }}
          />
        </View>

        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.8}
          className="bg-gray-200 border-[1.5px] border-gray-700 rounded-md h-[40px] w-[260px] justify-center items-center mt-4 mb-4 p-2 py-2"
        >
          <Text className="text-black text-lg font-semibold">
            {image ? 'Change Candidate Picture' : 'Upload Candidate Picture'}
          </Text>
        </TouchableOpacity>
        <View className='w-full justify-center items-center'>
          <TouchableOpacity
            onPress={handleCandidateSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
            className={`bg-green-800 rounded-md h-[40px] w-[240px] justify-center items-center mb-4 mt-4 p-2 ${
              isLoading ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-orange-400 text-lg font-semibold">
              {isLoading ? 'Adding Candidate...' : 'Add Candidate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-5 rounded-lg">
            <Text className="text-lg mb-3">{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-500 p-2 rounded"
            >
              <Text className="text-white text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CandidateForm;
