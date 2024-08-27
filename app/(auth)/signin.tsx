// src/screens/Auth/SignIn.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';

import { NavigationProp, useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  // const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    const storedPassword = await AsyncStorage.getItem('password');
    console.log(password)
    
    // Set password manually from here
    if (password === '1234') {
      navigation.navigate('(tabs)', { screen: 'admin' });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <View className="bg-white flex-1 items-center justify-center p-4">
      <View className='w-1/2 p-8 border border-gray-300 items-start rounded-md'>
        <Text className="text-3xl font-semibold mb-4">Sign In</Text>
        <Text className='py-2 text-lg font-semibold'>Password</Text>
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#a1a1a1"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="border border-gray-400 text-black py-3 px-2 w-full rounded-md"
          />
        
        <TouchableOpacity
              onPress={signIn}
              activeOpacity={0.8}
              className={`bg-orange-400 py-3 px-2 rounded-md w-full justify-center items-center mt-4`}
          >
            <Text className='text-green-800 font-medium text-lg'>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default styled(SignInScreen);
