import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import CardHeader from './CardHeader';

const UniqueVoteCount = () => {

    const { uniqueVotes } = useContext(CandidatesContext)!;

  return (
    <View className="bg-white w-full mt-2">
      <CardHeader title={'Voter Count'} />
      <View className='p-4 flex-row gap-16'>
        <Text className='pt-2 text-xl font-bold'>Number of people that have voted:</Text>
        <View className='border rounded-md items-center'>
          <Text className="font-semibold text-2xl py-2 px-4 text-green-600">{uniqueVotes}</Text>
        </View>
      </View>
    </View>
  )
}

export default UniqueVoteCount