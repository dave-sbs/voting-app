// import CandidateForm from '@/components/CandidateForm'
// import CandidateList from '@/components/CandidateList'
// import React from 'react'
// import { StyleSheet, Text, View } from 'react-native'
// import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
// import { SafeAreaView } from 'react-native-safe-area-context'

// const AdminPage = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaView className='h-full'>
//         <ScrollView>
//             <View className='w-full px-4'>
//                 <CandidateForm />
//                 <CandidateList />
//             </View>
//         </ScrollView>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   )
// }

// export default AdminPage

// const styles = StyleSheet.create({})

// src/screens/Tabs/Admin.tsx
import React from 'react';
import { View } from 'react-native';
import CandidateForm from '../../components/CandidateForm';
import CandidateList from '../../components/CandidateList';
import TallyTable from '../../components/TallyTable';
import { styled } from 'nativewind';

const AdminScreen = () => {
  return (
    <View className="flex-1 p-4">
      <CandidateForm />
      <CandidateList />
      <TallyTable />
    </View>
  );
};

export default styled(AdminScreen);