import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import CardHeader from './CardHeader';

import { useCandidateContext } from '@/app/(context)/CandidateContext';
import { Candidate } from '@/scripts/API/candidateAPI';


const CandidateList = () => {
  const { candidates, isLoading, error, fetchCandidates, deleteCandidate, clearCandidates } = useCandidateContext();

  useEffect(() => {
    if (error) {
      console.error('Context Error:', error);
      Alert.alert('Error', error);
    }
  }, [error]);


  const handleRemoveCandidate = (candidate: Candidate) => {
    deleteCandidate(candidate);
    fetchCandidates();
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Current Candidates'} />
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="pl-4 pr-80 flex-row items-center justify-between mb-2">
            <Text className="text-xl font-semibold">{item.name}</Text>
              <TouchableOpacity 
              onPress={() => handleRemoveCandidate(item)
              }>
                <Text className="text-xl font-semibold text-red-500 mr-80">Remove</Text>
              </TouchableOpacity>
            </View>
        )}
      />
    </View>
  );
};

export default CandidateList;
