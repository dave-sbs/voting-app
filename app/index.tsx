import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from "expo-router";
import React from 'react'

import PrimaryButton from '@/components/PrimaryButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const App = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 h-full bg-white'>
      <View className='items-center p-8 w-full h-1/3'>
        <Image source={require('../assets/images/7Eleven.png')} className='w-2/3 h-2/3' resizeMode='contain' />
      </View>
      <View className="items-center justify-center">
        <View className='justify-center items-center'>
          <Text className="text-4xl font-bold mb-4 text-blue-600">Welcome to the Voting App</Text>
          <View className='mt-40'>
            <TouchableOpacity
            onPress={() => navigation.navigate('(auth)', { screen: 'CheckIn' })}
            activeOpacity={0.8}
            className={`bg-orange-400  p-4 rounded-md min-h-[48px] min-w-[48px] justify-center items-center`}
            >
                <Text className='text-green-800 font-bold text-3xl'>
                    Click here to vote →
                </Text>
            </TouchableOpacity>
          </View>
        <TouchableOpacity
            onPress={() => router.push('/SignIn')}
            activeOpacity={0.8}
            className={`bg-green-800 p-2 rounded-md h-[48px] w-[220px] justify-center items-center mt-4 mb-2 `}
          >
            <Text className='text-white font-semibold text-lg'>
                Go To Admin Page
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Test position for admin button on home page */}
      {/* <View className='absolute right-4 bottom-4 p-4 items-end'>
        <TouchableOpacity
          onPress={() => router.push('/SignIn')}
          activeOpacity={0.8}
          className={`bg-orange-400 p-2 rounded-md h-[48px] w-[220px] justify-center items-center mt-4 mb-2 `}
        >
          <Text className='text-green-800 font-semibold text-lg'>
              Go To Admin Page
          </Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default App