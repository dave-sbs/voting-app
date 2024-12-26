import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useVotingContext } from '@/app/(context)/VotingContext';
import CardHeader from './CardHeader';
import LineBreak from './LineBreak';

const TallyTable = () => {
  const { votes } = useVotingContext();

  return (
    <View className="w-full bg-white mt-2">
      <CardHeader title={'Vote Tally'} />
      <View className='p-4'>
        <Text className='text-xl font-medium mb-4 text-blue-600'>Date of Vote:
          <Text className='text-xl font-semibold'>  {new Date().toLocaleDateString()}</Text>
        </Text>
        <View className='border-b-2 w-[60%] md:w-[45%] border-black' />
        <FlatList
          data={Object.entries(votes)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item }) => (
            <View className="flex-row">
              <View className='border-l-2 border-b-2 w-[50%] md:w-[35%] h-10 pl-4 justify-center'>
                <Text className='text-lg font-semibold'>{item[0]}</Text>
              </View>
              <View className='border-l-2 border-b-2 border-r-2 w-[10%] items-center justify-center'>
                <Text className='text-xl font-bold text-blue-600'>{item[1]}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default TallyTable;