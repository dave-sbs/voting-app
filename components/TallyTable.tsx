// src/components/TallyTable.tsx
import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';

const TallyTable = () => {
  const { votes } = useContext(CandidatesContext)!;

  return (
    <View className="p-4">
      <Text className="text-lg font-bold mb-2">Vote Tally</Text>
      <FlatList
        data={Object.entries(votes)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View className="flex-row justify-between mb-1">
            <Text>{item[0]}</Text>
            <Text>{item[1]}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default styled(TallyTable);