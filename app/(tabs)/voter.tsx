// src/screens/Tabs/Voter.tsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CandidateButton from '@/components/CandidateButton';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardHeader from '@/components/CardHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import { useRouter } from 'expo-router';

const VoterScreen = () => {
  const { candidates, votes, voters, currVoter, updateVoter, tallyVote, minChoice, uniqueVotes, setUniqueVotes } = useContext(CandidatesContext)!;
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [numColumns, setNumColumns] = useState(3);
  
  const router = useRouter();

  useEffect(() => {
    setColumnSize();
  })

  /**
   * Toggles the selection of a candidate. If the candidate is already selected,
   * remove them from the selection. Otherwise, add them to the selection.
   * @param {string} name the name of the candidate to toggle
   */
  const toggleSelection = (name: string) => {
    setSelectedCandidates(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  /**
   * Submits the user's vote. If the user has not already voted and has selected
   * at least minChoice candidates, the vote is submitted and the user is
   * redirected to the home page.
   */
  const submitVote = async () => {
    const currentVoter = voters.find(voter => voter.id === currVoter);

    // Check if the user has already voted and has selected at least minChoice candidates, then submit the vote
    if (selectedCandidates.length >= minChoice && currentVoter && !currentVoter.hasVoted) {
      let newUniqueChoice = uniqueVotes + 1;
      let newVotes = { ...votes };

      // Increment the vote count for each selected candidate
      for (const name of selectedCandidates) {
        newVotes = { ...newVotes, [name]: (newVotes[name] || 0) + 1 };
      }  

      // Update the unique votes and votes in storage
      setUniqueVotes(newUniqueChoice);
      tallyVote({ updatedVotes: newVotes });
      await AsyncStorage.setItem('votes', JSON.stringify(newVotes));

      // Update the user's hasVoted property in storage
      updateVoter(currVoter, true);

      // Reset the selected candidates and redirect to the home page
      setSelectedCandidates([]);
      alert("Vote submitted successfully!");
      router.push('/');
    } else if (currentVoter && currentVoter.hasVoted) {
      alert('You have already voted!');
    } else {
      alert(`Please select at least ${minChoice} candidates.`);
    }
  };

  const setColumnSize = () => {
    const screenWidth = Dimensions.get('window').width;
    if (screenWidth < 700) {
      setNumColumns(1);
    } else if (candidates.length < 6 && screenWidth > 700) {
      setNumColumns(2);
    } else if (candidates.length >= 6 && screenWidth > 750) {
      setNumColumns(3);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-white'>
        <ScrollView>
            <CardHeader title={'Voting Page'} />
            <Text className={`pt-8 pb-2 px-12 text-2xl font-bold text-red-500`}>Reminder:
              <Text className='text-2xl text-black font-normal'> Select at least
                <Text className='font-semibold text-red-500'> {minChoice} </Text> 
              {minChoice === 1 ? 'candidate' : 'candidates'}</Text>
            </Text>
            <Text className={`pb-6 px-12 text-2xl text-black font-normal`}>Press the button under the corresponding candidate of your choice. </Text>
            <HamburgerMenu sideChoice='right' />
            <View className={`w-full px-12`}>
              <FlatList
                key={`flatlist-${numColumns}`}
                data={candidates}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                renderItem={({ item }) => (
                  <View className={` ${ numColumns === 3 ? 'w-[200px] h-[360px] mr-8' :  'w-[260px] h-90 mr-16'} mt-3 mb-6 rounded-md border border-slate-500 bg-white`}>
                    <View className='rounded-t-md bg-gray-300 w-full h-60 overflow-hidden'>
                      <Image source={{ uri: item.image }} className='w-full h-full' />
                    </View>
                    <View className='p-2 items-center justify-center'>
                      <Text className='text-2xl font-bold'>{item.name}</Text>
                    </View>
                    <View className='w-full justify-center items-center'>
                      <View className='border-[0.5px] bg-black w-[75%] mb-3'/>
                    </View>
                    <View className='w-full justify-center items-center'>
                      <CandidateButton 
                        title={selectedCandidates.includes(item.name) ? "Candidate Selected" : "Select Candidate"}
                        handlePress={() => {toggleSelection(item.name)}}
                        color={selectedCandidates.includes(item.name) ? 'bg-orange-400' : 'bg-black'}
                        otherProps="mb-4"
                        isLoading={false}
                      />
                    </View>
                  </View>
                )}
              />
            </View>
            <View className='w-full justify-center items-center'>
                <TouchableOpacity
                    onPress={submitVote}
                    activeOpacity={0.8}
                    className={`bg-green-800 py-3 px-2 rounded-md w-[240px] justify-center items-center mt-4`}
                >
                  <Text className='text-white font-bold text-xl'>Submit Selections</Text>
              </TouchableOpacity>
            </View>
          <StatusBar backgroundColor="transparent" style="dark" />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default styled(VoterScreen);