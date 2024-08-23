import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from 'react-native'
import { useRouter } from "expo-router";
import React from 'react'

import PrimaryButton from '@/components/PrimaryButton';

const App = () => {
  const router = useRouter();

  return (
    <SafeAreaView className='h-full'>
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl font-bold mb-4">Welcome to the Voting App</Text>
        <PrimaryButton title="Click here to vote →" handlePress={() => router.push('/voter')} color="bg-black" isLoading={false} />
      </View>
    </SafeAreaView>
  );
};

export default App