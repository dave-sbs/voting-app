// import React from 'react';
// import { View, Text, Button, FlatList } from 'react-native';
// import { useVotingContext } from '@/app/(context)/VotingContext';
// import CardHeader from './CardHeader';

// const VoterList = () => {
//   const { votes } = useVotingContext();

//   return (
//     <View className="bg-white w-full mt-2 flex-1">
//       <CardHeader title={'Registered Voters'} />
//       <FlatList
//         data={votes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item, index }) => (
//             <View className='w-[50%] md:w-[35%]'>
//                 <Text className='text-lg font-semibold'>{item.name}</Text>
//             </View>
//         )}
//       />
//     </View>
//   );
// };

// export default VoterList;
