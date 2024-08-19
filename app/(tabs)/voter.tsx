import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import CandidateButton from '@/components/CandidateButton'
import PrimaryButton from '@/components/PrimaryButton'

const VoterPage = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full'>
        <ScrollView>
            <View className='w-full justify-center items-center px-4'>
              <View className='flex md:flex-row md:gap-x-4'>
                {/* Start of card component */}
                  <View className='m-3 rounded-md border bg-white w-[270px] h-90'>
                    <View className='rounded-md bg-gray-300 w-full h-60'>

                    </View>
                    <View className='p-2 items-center justify-center'>
                      <Text className='text-2xl font-bold'>Dave Boku</Text>
                    </View>
                    <View className='w-full justify-center items-center'>
                      <View className='border-[0.5px] bg-black w-[220px] mb-4'/>
                    </View>
                    <View className='w-full justify-center items-center'>
                      <CandidateButton title="Select Candidate" handlePress={() => {}} color="bg-green-500" otherProps="mb-4" isLoading={false} />
                    </View>
                  </View>

                  {/* Selected Candidate Card */}
                  <View className='m-3 rounded-md border bg-white w-[270px] h-90'>
                    <View className='rounded-md bg-gray-300 w-full h-60'>

                    </View>
                    <View className='p-2 items-center justify-center'>
                      <Text className='text-2xl font-bold'>Abel Shegere</Text>
                    </View>
                    <View className='w-full justify-center items-center'>
                      <View className='border-[0.5px] bg-black w-[220px] mb-4'/>
                    </View>
                    <View className='w-full justify-center items-center'>
                      <CandidateButton title="Candidate Selected" handlePress={() => {}} color="bg-indigo-500" otherProps="mb-4" isLoading={false} />
                    </View>
                  </View>
                </View>
                <StatusBar backgroundColor="transparent" style="dark" />
                <PrimaryButton title="Submit Selections" handlePress={() => {}} color="bg-blue-500" otherProps="mt-4" isLoading={false} />

            </View>
          </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default VoterPage

const styles = StyleSheet.create({})