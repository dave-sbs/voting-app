import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { CandidatesContext } from '@/app/(context)/CandidatesContext';
import { styled } from 'nativewind';
import CardHeader from './CardHeader';

const TallyTable = () => {
  const { votes } = useContext(CandidatesContext)!;

  return (
    <View className="w-full bg-white mt-2">
      <CardHeader title={'Vote Tally'} />
      <View className='p-4'>
        <View className='border-b w-[60%] md:w-[45%] border-black' />
        <FlatList
          data={Object.entries(votes)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item }) => (
            <View className="flex-row">
              <View className='border-l border-b w-[50%] md:w-[35%] h-10 pl-4 justify-center'>
                <Text className='text-lg font-semibold'>{item[0]}</Text>
              </View>
              <View className='border-l border-b border-r w-[10%] items-center justify-center'>
                <Text className='text-lg'>{item[1]}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default styled(TallyTable);