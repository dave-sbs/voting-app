import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import CardHeader from './CardHeader';
import LineBreak from './LineBreak';

import { useVotingContext } from '@/app/(context)/VotingContext';

interface ImageFile {
  uri: string;
  type: string;
  name: string;
}


const CandidateForm = () => {
    const { candidates, votes, addCandidate, removeCandidate, incrementVote, subscribe, unsubscribe } = useVotingContext();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<ImageFile | null>(null);

    // useEffect(() => {
    //   const onCandidateAdded = (candidate: any) => {
    //     console.log('Candidate added:', candidate);
    //   };

    //   subscribe('candidateAdded', onCandidateAdded);

    //   return () => {
    //     unsubscribe('candidateAdded', onCandidateAdded);
    //   };
    // }, [subscribe, unsubscribe]);


    const handleCandidateSubmit = async () => {
      if (!name || !image) {
        if (!name) Alert.alert("Error", "Please enter a name");
        if (!image) Alert.alert("Error", "Please upload a picture");
        return;
      }

      setIsLoading(true);

      try {  
        // Add the new candidate to the context
        handleAddCandidate(name, image.uri);
        
        setName('');
        setImage(null);
        Alert.alert("Success", "Candidate added successfully!");
      } catch (error) {
        Alert.alert("Error", "Failed to add candidate");
      } finally {
        setIsLoading(false);
      }
  };


    const handleAddCandidate = (name: string, image: string) => {
      console.log('Adding candidate...');
      addCandidate({ id: '', name: 'Twedy', image: '', vote_count: 0 });
    };
    
    const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
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
      
      const imageFile = {
        uri,
        type: blob.type || 'image/jpeg',
        name: `candidate-${Date.now()}.${blob.type?.split('/')[1] || 'jpg'}`
      };
      
      setImage(imageFile);
    }
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Add New Candidate'} />
      <LineBreak />
      <View className='p-4'>
        <View className='flex-row items-center'>
          {image && (
            <View className='w-[80px] h-[80px] rounded-full overflow-hidden'>
              <Image source={{ uri: image.uri }} style={{ width: 80, height: 80 }} />
            </View>
          )}
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

//   return (
//     <div>
//       <h1>All Candidates</h1>
//       <ul>
//         {candidates.map(candidate => (
//           <li key={candidate.id}>
//             {candidate.name} — {votes[candidate.id]} votes
//             <button onClick={() => handleVote(candidate.id)}>Vote</button>
//             <button onClick={() => handleRemoveCandidate(candidate.id)}>Remove</button>
//           </li>
//         ))}
//       </ul>
//       <button onClick={handleAddCandidate}>Add New Candidate</button>
//     </div>
//   );
// }


export default CandidateForm;