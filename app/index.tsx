import { Button, Text, View } from 'react-native'
import React from 'react'

import { Redirect, router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '@/components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <SafeAreaView className='h-full'>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
            <PrimaryButton title="Voting Page" handlePress={() => router.push('/voter')} color="bg-blue-500" isLoading={false} />
            <PrimaryButton title="Admin Page" handlePress={() => router.push('/admin')} color="bg-blue-500" otherProps="mt-4" isLoading={false} />
            <StatusBar backgroundColor="transparent" style="dark" />
        </View>
    </SafeAreaView>
  );
}

export default App
