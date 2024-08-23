import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import CardHeader from './CardHeader';

const UniqueVoteCount = () => {

    const { uniqueVotes } = useContext(CandidatesContext)!;

  return (
    <View className="bg-white w-full mt-2">
        <CardHeader title={'Number of Voters'} />
        <View className='p-4'>
            <Text className="text-base">Number of people that have voted:   
                <Text className="font-semibold"> {uniqueVotes}</Text>
            </Text>
        </View>
    </View>
  )
}

export default UniqueVoteCount

const styles = StyleSheet.create({})