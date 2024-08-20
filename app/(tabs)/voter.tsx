// src/screens/Tabs/Voter.tsx
import React, { useState, useContext } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CandidateButton from '@/components/CandidateButton';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VoterScreen = () => {
  const { candidates, votes, tallyVote, minChoice } = useContext(CandidatesContext)!;
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const toggleSelection = (name: string) => {
    setSelectedCandidates(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const submitVote = async () => {
    if (selectedCandidates.length >= minChoice) {
      let newVotes = { ...votes };
      for (const name of selectedCandidates) {
        newVotes = { ...newVotes, [name]: (newVotes[name] || 0) + 1 };
      }  

      tallyVote({ updatedVotes: newVotes });
      await AsyncStorage.setItem('votes', JSON.stringify(newVotes));

      setSelectedCandidates([]);
      alert("Vote submitted successfully!");
    } else {
      alert(`Please select at least ${minChoice} candidates.`);
    }
  };

  console.log(votes);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-slate-100'>
        <ScrollView>
            <View className='w-full justify-center items-center px-4'>
              <Text className="text-2xl font-bold mb-8">Select Candidates</Text>
              <View className='p-4 flex-row'>
                <FlatList
                  data={candidates}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                      <View className='mt-3 mb-3 rounded-md border bg-white w-[270px] h-90'>
                        <View className='rounded-md bg-gray-300 w-full h-60'>
                          <Image source={{ uri: item.image }} className='w-full h-full' />
                        </View>
                        <View className='p-2 items-center justify-center'>
                          <Text className='text-2xl font-bold'>{item.name}</Text>
                        </View>
                        <View className='w-full justify-center items-center'>
                          <View className='border-[0.5px] bg-black w-[220px] mb-4'/>
                        </View>
                        <View className='w-full justify-center items-center'>
                          <CandidateButton title={selectedCandidates.includes(item.name) ? "Candidate Selected" : "Select Candidate"} handlePress={() => {toggleSelection(item.name)}} color={selectedCandidates.includes(item.name) ? 'bg-indigo-500' : 'bg-green-500'} otherProps="mb-4" isLoading={false} />
                        </View>
                      </View>
                  )}
                />
                </View>
                <TouchableOpacity
                    onPress={submitVote}
                    activeOpacity={0.8}
                    className={`bg-blue-500 p-4 rounded-md w-[240px] justify-center items-center mt-4`}
                >
                  <Text className='text-white font-medium text-xl'>Submit Votes</Text>
              </TouchableOpacity>
            </View>
          <StatusBar backgroundColor="transparent" style="dark" />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default styled(VoterScreen);