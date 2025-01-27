import React, { useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';

import CardHeader from './CardHeader';

import { useVotingContext } from '@/app/(context)/VotingContext';
import { useCandidateContext } from '@/app/(context)/CandidateContext';

export interface Candidate {
  id: string;
  name: string;
  profile_picture: string;
  vote_count: number;
}

const TallyTable = () => {
  const { candidates, isLoading, error, fetchCandidates } = useCandidateContext();

  useEffect(() => {
    fetchCandidates()}, []);

  return (
    <View className="w-full bg-white mt-2">
      <CardHeader title={'Vote Tally'} />
      <View className='p-4'>
        <Text className='text-xl font-medium mb-4 text-blue-600'>Date of Vote:
          <Text className='text-xl font-semibold'>  {new Date().toLocaleDateString()}</Text>
        </Text>
        <View className='border-b-2 w-[60%] border-black' />
        <View className='flex-row'>
            <View className='border-l-2 border-b-2 w-[5%] h-10 items-center justify-center' />
            <View className='border-l-2 border-b-2 w-[35%] h-10 items-center justify-center'>
                <Text className='text-lg font-bold text-blue-600'>FRANCHISEE NAME</Text>
            </View>
            <View className="border-l-2 border-b-2 border-r-2 w-[20%] items-center justify-center">
                <Text className='text-lg font-bold text-blue-600'>VOTE COUNT</Text>
            </View>
        </View>
        <FlatList
          data={candidates}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row">
              <View className='border-l-2 border-b-2 w-[5%] h-10 items-center justify-center' />
              <View className='border-l-2 border-b-2 w-[35%] h-10 justify-center items-center'>
                  <Text className='text-lg font-semibold'>{item.name || 'Loading...'}</Text>
              </View>
              <View className='border-l-2 border-b-2 border-r-2 w-[20%] items-center justify-center'>
                  <Text className='text-lg font-semibold'>{item.vote_count || 0}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default TallyTable;