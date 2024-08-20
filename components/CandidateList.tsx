import React, { useContext } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';

const CandidateList = () => {
  const { candidates, removeCandidate } = useContext(CandidatesContext)!;

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mt-8 mb-4">Current Candidates</Text>
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center mb-2">
            <View className='w-[45%]'>
              <Text className='text-lg'>{item.name}</Text>
            </View>
            <Button title="Remove" onPress={() => removeCandidate(item.name)} />
          </View>
        )}
      />
    </View>
  );
};

export default styled(CandidateList);
