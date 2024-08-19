// src/screens/Auth/SignIn.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';

import { NavigationProp } from '@react-navigation/native';

const SignInScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    const storedUsername = await AsyncStorage.getItem('username');
    const storedPassword = await AsyncStorage.getItem('password');
    
    if (username === storedUsername && password === storedPassword) {
      navigation.navigate('Tabs', { screen: 'Admin' });
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
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
  );
};

export default styled(SignInScreen);