// src/screens/Tabs/Voter.tsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CandidateButton from '@/components/CandidateButton';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardHeader from '@/components/CardHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

const VoterScreen = () => {
  const { candidates, votes, tallyVote, minChoice, uniqueVotes, setUniqueVotes } = useContext(CandidatesContext)!;
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [numColumns, setNumColumns] = useState(3);

  useEffect(() => {
    setColumnSize();
  })

  const toggleSelection = (name: string) => {
    setSelectedCandidates(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const submitVote = async () => {
    if (selectedCandidates.length >= minChoice) {
      let newUniqueChoice = uniqueVotes + 1;
      let newVotes = { ...votes };

      for (const name of selectedCandidates) {
        newVotes = { ...newVotes, [name]: (newVotes[name] || 0) + 1 };
      }  

      setUniqueVotes(newUniqueChoice);
      tallyVote({ updatedVotes: newVotes });
      await AsyncStorage.setItem('votes', JSON.stringify(newVotes));

      setSelectedCandidates([]);
      alert("Vote submitted successfully!");
    } else {
      alert(`Please select at least ${minChoice} candidates.`);
    }
  };

  const setColumnSize = () => {
    if (candidates.length <= 6) {
      setNumColumns(2);
    } else {
      setNumColumns(3);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-white'>
        <ScrollView>
            <CardHeader title={'Voting Page'} />
            <HamburgerMenu />
            <Text className={`pt-8 pb-4 ${ numColumns === 3 ? 'px-12' : 'px-24'} text-lg font-bold`}>Reminder:
              <Text className='font-normal'> You have to select at least {minChoice} {minChoice === 1 ? 'candidate' : 'candidates'}</Text>
            </Text>
            <View className={`w-full ${ numColumns === 3 ? 'px-12' : 'px-24'}`}>
              <FlatList
                key={`flatlist-${numColumns}`}
                data={candidates}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                renderItem={({ item }) => (
                  <View className={` ${ numColumns === 3 ? 'w-[200px] h-[260px] mr-12' :  'w-[270px] h-90 mr-16'} mt-3 mb-6 rounded-md border border-slate-500 bg-white`}>
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
                        color={selectedCandidates.includes(item.name) ? 'bg-indigo-500' : 'bg-gray-300'}
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
                    className={`bg-black py-3 px-2 rounded-md w-[240px] justify-center items-center mt-4`}
                >
                  <Text className='text-white font-medium text-xl'>Submit Selections</Text>
              </TouchableOpacity>
            </View>
          <StatusBar backgroundColor="transparent" style="dark" />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default styled(VoterScreen);