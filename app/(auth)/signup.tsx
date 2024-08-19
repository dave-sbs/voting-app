// src/screens/Auth/SignUp.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
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
    <View className="flex-1 justify-center p-4">
      <Text className="text-lg font-bold mb-4">Sign Up</Text>
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
      <Button title="Sign Up" onPress={signUp} />
    </View>
  );
};

export default styled(SignUpScreen);