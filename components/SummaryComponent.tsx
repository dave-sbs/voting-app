import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CardHeader from './CardHeader'
import SecondaryButton from './SecondaryButton'
import { useRouter } from 'expo-router'

const SummaryTable = () => {

    const router = useRouter();

  return (
    <View className="bg-white w-full mt-2 flex-1">
        <CardHeader title={'Summary Page'} />
        <View className='px-2'>
            <TouchableOpacity
                onPress={() => router.push('/summaryPage')}
                activeOpacity={0.8}
                className={`bg-green-800 p-2 rounded-md h-[48px] w-[220px] justify-center items-center mt-4 mb-2 `}
            >
                <Text className='text-orange-500 font-semibold text-lg'>
                    Go To Summary Page →
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default SummaryTable

const styles = StyleSheet.create({})