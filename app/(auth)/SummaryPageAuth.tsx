// src/screens/Auth/SignIn.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';

const SummaryPageAuth = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [password, setPassword] = useState('');

  const signIn = async () => {
    // Set password manually from here
    if (password === '1234') {
      navigation.navigate('(tabs)', { screen: 'summaryPage' });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <View className="bg-white flex-1 items-center justify-center p-4">
      <View className='w-1/2 p-8 border border-gray-300 items-start rounded-md'>
        <Text className="text-3xl font-semibold mb-4">Sign In to Summary</Text>
        <Text className='py-2 text-lg font-semibold'>Password (Same as Admin Password)</Text>
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
              className={`bg-green-800 py-3 px-2 rounded-md w-full justify-center items-center mt-4`}
          >
            <Text className='text-orange-500 font-medium text-lg'>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SummaryPageAuth;
