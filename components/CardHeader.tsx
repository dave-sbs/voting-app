import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LineBreak from './LineBreak'

const CardHeader = ( { title }: { title: string } ) => {
  return (
    <View className='w-full'>
        <Text className="text-2xl font-bold px-4 pt-4 pb-4 text-green-700">{title}</Text>
        <LineBreak />
    </View>
  )
}

export default CardHeader


