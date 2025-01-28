import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from "expo-router";
import React from 'react'

// import PrimaryButton from '@/components/PrimaryButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import HamburgerMenu from '@/components/HamburgerMenu';

const App = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 h-full bg-white'>
      <View className='mt-6 ml-2 mb-8'>
        <HamburgerMenu sideChoice='left'/>
      </View>
      <View className='items-center p-8 w-full h-1/4'>
          <Image source={require('../assets/images/7Eleven.png')} className='w-2/3 h-2/3' resizeMode='contain' />
      </View>
      <View className="items-center justify-center">
        <View className='justify-center items-center'>
          <Text className="text-5xl font-bold mt-12 mb-4 text-orange-500">Welcome to the Voting App</Text>
          <View className='mt-20'>
            <TouchableOpacity
              onPress={() => navigation.navigate('(auth)', { screen: 'CheckIn' })}
              activeOpacity={0.8}
              className="bg-green-800 p-6 rounded-md shadow-lg mt-16 min-w-[200px] justify-center items-center"
            >
              <Text className='text-orange-500 font-bold text-4xl'>
                Click here to vote →
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => navigation.navigate('(tabs)', { screen: 'payments' })}
              activeOpacity={0.8}
              className="bg-green-800 p-6 rounded-md shadow-lg mt-16 min-w-[200px] justify-center items-center"
            >
              <Text className='text-orange-500 font-bold text-4xl'>
                Record Payments →
              </Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App