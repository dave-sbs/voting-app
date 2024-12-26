import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CandidateForm from '../../components/CandidateForm';
import CandidateList from '../../components/CandidateList';
import MinimumChoiceInput from '@/components/MinimumChoiceInput';
import TallyTable from '../../components/TallyTable';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
// import UniqueVoteCount from '@/components/UniqueVoteCount';
// import SummaryComponent from '@/components/SummaryComponent';
import MaximumChoiceInput from '@/components/MaximumChoiceInput';
// import VoterList from '@/components/VoterList';
// import VoterForm from '@/components/VoterForm';

const AdminScreen = () => {
  const [ screen, setScreen ] = useState('candidates');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-white'>
        <ScrollView>
          <View className="flex-1">
          <View className='bg-slate-200'>
              <View className='flex-1 flex-row gap-12 justify-center bg-white'>
              <TouchableOpacity
                onPress={() => setScreen('candidates')}
                className={`bg-green-800 p-1 rounded-md h-[50px] w-[280px] justify-center items-center mt-1 mb-4`}
              >
                <Text className='text-orange-500 font-bold text-xl'>
                  Manage Candidates
                </Text>
              </TouchableOpacity>
              <Text className='px-1 mb-1 text-6xl text-gray-200 font-extralight'>
                I
              </Text>
              <TouchableOpacity
                onPress={() => setScreen('voters')}
                className={`bg-green-800 p-1 rounded-md h-[50px] w-[280px] justify-center items-center mt-1 mb-4`}
              >
                <Text className='text-orange-500 font-bold text-xl'>
                  Manage Voters
                </Text>
            </TouchableOpacity>
              </View>
              
              <View className={`flex-1 ${screen === 'candidates' ? 'block' : 'hidden'}`}>
                <CandidateForm />
                <MinimumChoiceInput />
                <MaximumChoiceInput />
                <CandidateList />
                {/* <UniqueVoteCount /> */}
                <TallyTable />
              </View>
              
              <View className={`flex-1 ${screen === 'voters' ? 'block' : 'hidden'}`}>
                {/* <VoterForm />
                <UniqueVoteCount />
                <SummaryComponent /> */}
              </View>

              </View>
            </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default AdminScreen;