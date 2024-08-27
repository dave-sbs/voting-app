import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { CandidatesContext } from '../(context)/CandidatesContext';
import CardHeader from '@/components/CardHeader';
import SecondaryButton from '@/components/SecondaryButton';

const summaryPage = () => {

    const { voters, resetVotersArr } = useContext(CandidatesContext)!;
        

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-white'>
        <ScrollView>
            <CardHeader title={'Voter Summary'} />
            <View className='p-4'>
                <Text className='text-xl font-medium mb-4 text-blue-600'>Date of Vote:
                    <Text className='text-xl font-semibold'>  {new Date().toLocaleDateString()}</Text>
                </Text>
                <View className='border-b-2 w-[60%] border-black' />
                <View className='flex-row'>
                    <View className='border-l-2 border-b-2 w-[30%] h-10 items-center justify-center'>
                        <Text className='text-lg font-bold text-blue-600'>FRANCHISEE ID</Text>
                    </View>
                    <View className='border-l-2 border-b-2 border-r-2 w-[30%] items-center justify-center'>
                        <Text className='text-lg font-bold text-blue-600'>HAS VOTED</Text>
                    </View>
                </View>
                <FlatList 
                    data={voters}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View className='flex-row'>
                            <View className='border-l-2 border-b-2 w-[30%] h-10 justify-center items-center'>
                                <Text className='text-lg font-semibold'>{item.id}</Text>
                            </View>
                            <View className={`${item.hasVoted.toString() === "true" ? 'bg-green-300' : 'bg-red-300'} border-l-2 border-b-2 border-r-2 w-[30%] items-center justify-center'`}>
                                <Text className='text-lg font-bold mt-1'>{item.hasVoted.toString()}</Text>
                            </View>
                        </View>
                    )}
                />

                <View className='py-4'>
                    <SecondaryButton title="Clear Data" handlePress={resetVotersArr}  />
                </View>
            </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default summaryPage

const styles = StyleSheet.create({})