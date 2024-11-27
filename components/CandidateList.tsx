import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { FlatList } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import CardHeader from './CardHeader';
import LineBreak from './LineBreak';

const CandidateList = () => {
  const { candidates, removeCandidate } = useContext(CandidatesContext)!;

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Current Candidates'} />
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View className="px-4 flex-row items-center mb-2">
            <View className='w-[50%] md:w-[35%]'>
              <Text className='text-lg font-semibold'>{item.name}</Text>
            </View>
            <Button title="Remove" onPress={() => removeCandidate(item.name)} />
          </View>
        )}
      />
    </View>
  );
};

export default CandidateList;
