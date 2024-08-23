// src/screens/Auth/SignIn.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
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
      navigation.navigate('(tabs)', { screen: 'Admin' });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-lg font-bold mb-4">Sign In</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        className="border p-2 mb-4"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border p-2 mb-4"
      />
      <Button title="Sign In" onPress={signIn} />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('(auth)', { screen: 'SignUp' })}
      />
    </View>
  );
};

export default styled(SignInScreen);
