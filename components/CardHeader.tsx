import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LineBreak from './LineBreak'

const CardHeader = ( { title }: { title: string } ) => {
  return (
    <View className='w-full'>
        <Text className="text-green-800 text-3xl font-bold px-4 pt-4 pb-4">{title}</Text>
        <LineBreak />
    </View>
  )
}

export default CardHeader


