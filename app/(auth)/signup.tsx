// src/screens/Auth/SignUp.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';

import { NavigationProp } from '@react-navigation/native';

const SignUpScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    if (username && password) {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      alert('Account created successfully!');
      navigation.navigate('SignIn');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    // <View className="flex-1 justify-center p-4">
    //   <Text className="text-lg font-bold mb-4">Sign Up</Text>
    //   <TextInput
    //     placeholder="Username"
    //     value={username}
    //     onChangeText={setUsername}
    //     className="border p-2 mb-4"
    //   />
    //   <TextInput
    //     placeholder="Password"
    //     value={password}
    //     onChangeText={setPassword}
    //     secureTextEntry
    //     className="border p-2 mb-4"
    //   />
    //   <Button title="Sign Up" onPress={signUp} />
    // </View>

    <View className="bg-white flex-1 items-center justify-center p-4">
    <Text className="text-2xl font-bold mb-4">Sign Up</Text>
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
          onPress={signUp}
          activeOpacity={0.8}
          className={`bg-black py-3 px-2 rounded-md w-[140px] justify-center items-center mt-6`}
      >
        <Text className='text-white font-medium text-lg'>Sign Up</Text>
    </TouchableOpacity>

    </View>
  );
};

export default styled(SignUpScreen);