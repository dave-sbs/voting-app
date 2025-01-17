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
        console.warn('Submission Error: Name is missing');
        showModal('Please enter a name');
      }
      if (!image) {
        console.warn('Submission Error: Image is missing');
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

      console.log('Candidate added successfully:', { name, image: image.uri });
      setName('');
      setImage(null);
      showModal('Candidate added successfully!');
      fetchCandidates();
    } catch (err: any) {
      console.error('Failed to add candidate:', err);
      showModal(err.message || 'Failed to add candidate');
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

        <View className="pt-12 relative">
          <TextInput
            className="bg-gray-100 p-4 rounded-md"
            placeholder="Enter candidate name"
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
          className="bg-blue-800 rounded-md h-[40px] justify-center items-center mt-4 mb-4"
        >
          <Text className="text-white font-bold">
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
