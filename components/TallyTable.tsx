import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';

const TallyTable = () => {
  const { votes } = useContext(CandidatesContext)!;

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mt-8 mb-4">Vote Tally</Text>
      <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', width: '70%' }} />
      <FlatList
        data={Object.entries(votes)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View className="flex-row">
            <View className='border-l border-b w-[50%] pl-4 justify-center'>
              <Text className='text-lg'>{item[0]}</Text>
            </View>
            <View className='border-l border-b border-r w-[20%] items-center justify-center'>
              <Text className='text-lg'>{item[1]}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default styled(TallyTable);