import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CardHeader = ( { title }: { title: string } ) => {
  return (
    <View className='w-full'>
        <Text className="text-lg font-bold px-4 pt-4 pb-2 text-neutral-500">{title}</Text>
        <View className='border-b w-full border-gray-300' />
    </View>
  )
}

export default CardHeader


