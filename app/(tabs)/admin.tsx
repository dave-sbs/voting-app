import React from 'react';
import { View } from 'react-native';
import CandidateForm from '../../components/CandidateForm';
import CandidateList from '../../components/CandidateList';
import MinimumChoiceInput from '@/components/MinimumChoiceInput';
import TallyTable from '../../components/TallyTable';
import { styled } from 'nativewind';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import UniqueVoteCount from '@/components/UniqueVoteCount';
import SummaryComponent from '@/components/SummaryComponent';

const AdminScreen = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-white'>
        <ScrollView>
          <View className="flex-1">
            <View className='bg-slate-200'>
              <CandidateForm />
              <MinimumChoiceInput />
              <CandidateList />
              <UniqueVoteCount />
              <TallyTable />
              <SummaryComponent />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default styled(AdminScreen);