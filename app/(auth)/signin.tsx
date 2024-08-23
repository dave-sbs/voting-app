// src/screens/Auth/SignIn.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';

import { NavigationProp, useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    const storedPassword = await AsyncStorage.getItem('password');
    
    if (username === storedUsername && password === storedPassword) {
      navigation.navigate('(tabs)', { screen: 'admin' });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <View className="bg-white flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-4">Sign In</Text>
      <View className='p-4 flex-row gap-6 items-center'>
        <Text className='text-base font-bold'>Username</Text>
        <TextInput
          placeholder=""
          value={username}
          onChangeText={setUsername}
          className="border-b-0.5 border-gray-400 text-black py-1 px-1 w-[200px]"
        />
      </View>

      <View className='p-4 flex-row gap-6 items-center'>
      <Text className='text-base font-bold'>Password</Text>
        <TextInput
          placeholder=""
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border-b-0.5 border-gray-400 text-black py-1 px-1 w-[200px]"
        />
      </View>
      
      <TouchableOpacity
            onPress={signIn}
            activeOpacity={0.8}
            className={`bg-black py-3 px-2 rounded-md w-[140px] justify-center items-center mt-6`}
        >
          <Text className='text-white font-medium text-lg'>Sign In</Text>
      </TouchableOpacity>

      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('(auth)', { screen: 'SignUp' })}
      />
    </View>
  );
};

export default styled(SignInScreen);
