import React from 'react';
import { View } from 'react-native';
import CandidateForm from '../../components/CandidateForm';
import CandidateList from '../../components/CandidateList';
import MinimumChoiceInput from '@/components/MinimumChoiceInput';
import TallyTable from '../../components/TallyTable';
import { styled } from 'nativewind';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const AdminScreen = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-slate-100'>
        <ScrollView>
          <View className="flex-1 p-4">
            <CandidateForm />
            <MinimumChoiceInput />
            <CandidateList />
            <TallyTable />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default styled(AdminScreen);