import { Button, Text, View } from 'react-native'
import React from 'react'
import { Redirect, router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";

import PrimaryButton from '@/components/PrimaryButton';
import { CandidatesProvider } from '@/app/(context)/CandidatesContext';

const App = () => {
  const router = useRouter();

  return (
    <SafeAreaView className='h-full'>
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl font-bold mb-4">Welcome to the Voting App</Text>
        <PrimaryButton title="Voting Page" handlePress={() => router.push('/voter')} color="bg-blue-500" isLoading={false} />
        <PrimaryButton title="Admin Page" handlePress={() => router.push('/admin')} color="bg-blue-500" otherProps="mt-4" isLoading={false} />
      </View>
    </SafeAreaView>
  );
};

export default App