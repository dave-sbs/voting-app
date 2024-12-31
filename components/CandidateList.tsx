import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CardHeader from './CardHeader';
import { useVotingContext } from '@/app/(context)/VotingContext';


const CandidateList = () => {
  const { candidates, removeCandidate, subscribe, unsubscribe } = useVotingContext();

  // useEffect(() => {
  //   const handleCandidatesUpdate = (updatedCandidates: Candidate[]) => {
  //     setLocalCandidates(updatedCandidates);
  //   };

  //   subscribe('candidateAdded', handleCandidatesUpdate);
  //   setLocalCandidates(candidates);

  //   return () => {
  //     unsubscribe('candidateAdded', handleCandidatesUpdate);
  //   };
  // }, [candidates, subscribe, unsubscribe]);

  // const handleRemoveCandidate = (id: number) => {
  //   removeCandidate(id);
  // };


  const handleRemoveCandidate = (id: string) => {
    removeCandidate(id);
  };

  // const handleVote = (id: string) => {
  //   incrementVote(id);
  // };


  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Current Candidates'} />
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="px-4 flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveCandidate(item.id)}>
              <Text className="text-md text-red-500">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default CandidateList;
