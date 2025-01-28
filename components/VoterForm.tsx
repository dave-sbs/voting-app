import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { useMemberContext } from '@/app/(context)/MemberContext';
import CardHeader from './CardHeader';
import LineBreak from './LineBreak';

type ActionType = 'add' | 'remove' | 'addBoard' | 'removeBoard';

const MemberForm = () => {
  const [memberName, setMemberName] = useState('');
  const [storeNumber, setStoreNumber] = useState('');
  const [actionType, setActionType] = useState<ActionType>('add');
  
  const { 
    isLoading,
    error,
    addMember,
    removeMember,
    updateBoardStatus
  } = useMemberContext();

  const handleSubmit = async () => {
    if (!memberName || !storeNumber) {
      Alert.alert(
        'Missing Information',
        'Please enter both member name and store number.'
      );
      return;
    }

    try {
      switch (actionType) {
        case 'add':
          await addMember(memberName, storeNumber);
          Alert.alert('Success', 'Member added successfully');
          break;
        case 'remove':
          await removeMember(memberName, storeNumber);
          Alert.alert('Success', 'Member removed successfully');
          break;
        case 'addBoard':
          await updateBoardStatus(memberName, storeNumber, true);
          Alert.alert('Success', 'Board member status added successfully');
          break;
        case 'removeBoard':
          await updateBoardStatus(memberName, storeNumber, false);
          Alert.alert('Success', 'Board member status removed successfully');
          break;
      }
      
      // Clear form on success
      setMemberName('');
      setStoreNumber('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title="Member Management" />

      <Text className="mt-6 text-xl font-bold px-4">Select Action</Text>
      
      <View className="px-4 flex-row flex-wrap gap-6 justify-start mt-6 mb-6">
        <TouchableOpacity
          onPress={() => setActionType('add')}
          className={`rounded-md p-4 w-[300px] items-center ${actionType === 'add' ? 'bg-green-800 border-[1.75px] border-slate-200' : 'bg-gray-200 border-gray-700 border-[1.5px]'}`}
        >
          <Text className={`text-lg font-semibold ${actionType === 'add' ? 'text-white' : 'text-gray-700'}`}>
            Add Organization Member
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActionType('remove')}
          className={`rounded-md p-4 w-[300px] items-center ${actionType === 'remove' ? 'bg-green-800 border-[1.75px] border-slate-200' : 'bg-gray-200 border-gray-700 border-[1.5px]'}`}
        >
          <Text className={`text-lg font-semibold ${actionType === 'remove' ? 'text-white' : 'text-gray-700'}`}>
            Remove Member
          </Text>
        </TouchableOpacity>
        </View>

        <View className="px-4 flex-row flex-wrap gap-6 justify-start mb-6">
        <TouchableOpacity
          onPress={() => setActionType('addBoard')}
          className={`rounded-md p-4 w-[300px] items-center ${actionType === 'addBoard' ? 'bg-green-800 border-[1.75px] border-slate-200' : 'bg-gray-200  border-gray-700 border-[1.5px]'}`}
        >
          <Text className={`text-lg font-semibold ${actionType === 'addBoard' ? 'text-white' : 'text-gray-700'}`}>
            Add Board Member
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActionType('removeBoard')}
          className={`rounded-md p-4 w-[300px] items-center ${actionType === 'removeBoard' ? 'bg-green-800 border-[1.75px] border-slate-200' : 'bg-gray-200   border-gray-700 border-[1.5px]'}`}
        >
          <Text className={`text-lg font-semibold ${actionType === 'removeBoard' ? 'text-white' : 'text-gray-700'}`}>
            Remove Board Member
          </Text>
        </TouchableOpacity>
      </View>

      <View className='border-b w-[96%] border-gray-300 border-s-8 ml-4 mb-2' />

      <View className="px-4 py-4 flex-col gap-2">
        <Text className="text-lg font-semibold w-[150px]">Member Name</Text>
        <TextInput
          placeholder="Enter Member Name"
          placeholderTextColor="#6b7280"
          value={memberName}
          onChangeText={setMemberName}
          className="border-[1.25px] rounded-md border-gray-200 text-black p-3 w-[400px]"
        />
      </View>

      <View className="px-4 py-1 flex-col gap-2 mb-4">
        <Text className="text-lg font-semibold w-[150px]">Store Number</Text>
        <TextInput
          placeholder="Enter Store Number"
          placeholderTextColor="#6b7280"
          value={storeNumber}
          onChangeText={setStoreNumber}
          keyboardType="numeric"
          className="border-[1.25px] rounded-md border-gray-200 text-black p-3 w-[400px]"
        />
      </View>

      <View className="items-center justify-center mb-4">
        {isLoading ? (
          <ActivityIndicator size="small" color="#475569" />
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.8}
            className="bg-green-800 rounded-md h-[45px] w-[240px] justify-center items-center"
          >
            <Text className="text-orange-500 font-semibold text-lg">
              Confirm {actionType === 'add' || actionType === 'addBoard' ? 'Addition' : 'Removal'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-center mt-4">
          {error}
        </Text>
      )}
    </View>
  );
};

export default MemberForm;