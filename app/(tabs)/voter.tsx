import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import CardHeader from '@/components/CardHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import CandidateButton from '@/components/CandidateButton';

import { useVotingContext } from '@/app/(context)/VotingContext';
import { useChoiceContext } from '@/app/(context)/VoteChoiceContext';
import { useRouter } from 'expo-router';

interface Candidate {
  id: string;
  name: string;
  profile_picture: string;
  vote_count: number;
}

const VoterScreen = () => {
  /**
   * Pull data & actions from VotingContext
   */
  const {
    // State
    candidates,
    chosenCandidatesList,
    
    // Loading & Error
    isLoading,
    error,
    
    // Actions
    castVotes,
    selectCandidate,
    deselectCandidate,
  } = useVotingContext();

  const { minChoice, maxChoice } = useChoiceContext();

  /**
   * Additional local states for UI
   */
  const [numColumns, setNumColumns] = useState(3);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const router = useRouter();

  // Dynamically set the number of columns based on screen size & candidate count
  const setColumnSize = () => {
    const screenWidth = Dimensions.get('window').width;
    // Adjust your logic here as needed
    if (screenWidth < 700) {
      setNumColumns(1);
    } else if (candidates.length < 6 && screenWidth > 700) {
      setNumColumns(2);
    } else if (candidates.length >= 6 && screenWidth > 750) {
      setNumColumns(3);
    }
  };

  // Runs every render or whenever candidates change
  useEffect(() => {
    setColumnSize();
  }, [candidates]);

  /**
   * Toggle candidate selection by context
   * (if candidate is in chosenCandidatesList, deselect; else select)
   */
  const handleToggleCandidate = (candidate: Candidate) => {
    const alreadySelected = chosenCandidatesList.some((c) => c.id === candidate.id);
    if (alreadySelected) {
      deselectCandidate(candidate); 
    } else {
      selectCandidate(candidate);
    }
  };

  /**
   * Show a modal with a custom message
   */
  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  /**
   * Submit the vote via the context’s castVotes method
   */
  const submitVote = async () => {
    // Check min/max
    if (chosenCandidatesList.length < minChoice) {
      showModal(`You must select at least ${minChoice} candidate${minChoice > 1 ? 's' : ''}.`);
      return;
    }
    if (chosenCandidatesList.length > maxChoice) {
      showModal(`You can only select a maximum of ${maxChoice} candidate${maxChoice > 1 ? 's' : ''}.`);
      return;
    }

    try {
      await castVotes();
      showModal('Vote submitted successfully!');
      router.push('/'); 
    } catch (err: any) {
      showModal(err.message || 'Failed to submit vote');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="h-full bg-white">
        <ScrollView>
          <CardHeader title="Voting Page" />

          <Text className="pt-8 pb-2 px-12 text-2xl font-bold text-red-500">Reminders:</Text>
          <View className="border-l-4 ml-12 px-2">
            <Text className="text-2xl text-black font-normal">
              Please select a maximum of
              <Text className="font-semibold text-red-500"> {maxChoice} </Text>
              {maxChoice === 1 ? 'candidate' : 'candidates'}.
            </Text>
          </View>
          <Text className="pt-4 pb-6 px-12 text-2xl text-black font-normal">
            Press the button under the corresponding candidate of your choice.
          </Text>

          <HamburgerMenu sideChoice="right" />

          <View className="w-full px-12">
            {/* Display any global error from the context (if desired) */}
            {error && (
              <Text style={{ color: 'red', marginBottom: 8 }}>
                {error}
              </Text>
            )}

            <FlatList
              key={`flatlist-${numColumns}`}
              data={candidates}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              renderItem={({ item }) => {
                const isSelected = chosenCandidatesList.some((c) => c.id === item.id);
                return (
                  <View
                    className={`${
                      numColumns === 3 ? 'w-[200px] h-[360px] mr-8' : 'w-[260px] h-90 mr-16'
                    } mt-3 mb-6 rounded-md border border-slate-500 bg-white`}
                  >
                    <View className="rounded-t-md bg-gray-300 w-full h-60 overflow-hidden">
                      <Image source={{ uri: item.profile_picture }} className="w-full h-full" />
                    </View>
                    <View className="p-2 items-center justify-center">
                      <Text className="text-2xl font-bold">{item.name}</Text>
                    </View>
                    <View className="w-full justify-center items-center">
                      <View className="border-[0.5px] bg-black w-[75%] mb-3" />
                    </View>
                    <View className="w-full justify-center items-center">
                      <CandidateButton
                        title={isSelected ? 'Candidate Selected' : 'Select Candidate'}
                        handlePress={() => handleToggleCandidate(item)}
                        color={isSelected ? 'bg-orange-400' : 'bg-black'}
                        otherProps="mb-4"
                        isLoading={false}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>

          <View className="w-full justify-center items-center">
            <TouchableOpacity
              onPress={submitVote}
              activeOpacity={0.8}
              disabled={isLoading}
              className={`bg-green-800 py-3 px-2 rounded-md w-[240px] justify-center items-center mt-4 ${
                isLoading ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-orange-500 font-bold text-xl">
                {isLoading ? 'Submitting...' : 'Submit Selections'}
              </Text>
            </TouchableOpacity>
          </View>

          <StatusBar backgroundColor="transparent" style="dark" />
        </ScrollView>

        {/* Simple modal for messages */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white bg-opacity-80 p-5 rounded-md justify-center items-center w-3/5">
              <Text className="text-xl text-orange-500 font-bold mb-3">Notice</Text>
              <Text className="mb-4 text-lg font-semibold">{modalMessage}</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="bg-green-800 py-2 px-4 rounded-md self-end"
              >
                <Text className="text-orange-400 font-bold">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default VoterScreen;
