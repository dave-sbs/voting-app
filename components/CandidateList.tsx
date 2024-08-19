// src/components/CandidateList.tsx
import React, { useContext } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';

const CandidateList = () => {
  const { candidates, removeCandidate } = useContext(CandidatesContext)!;

  return (
    <View className="p-4">
      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View className="flex-row justify-between items-center mb-2">
            <Text>{item.name}</Text>
            <Button title="Remove" onPress={() => removeCandidate(item.name)} />
          </View>
        )}
      />
    </View>
  );
};

export default styled(CandidateList);
