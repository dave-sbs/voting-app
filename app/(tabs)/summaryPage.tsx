import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CardHeader from '@/components/CardHeader';
import SecondaryButton from '@/components/SecondaryButton';

import { getNamefromId, getStoreNumberfromId } from '@/scripts/API/checkInAPI';

import { useVotingContext } from '@/app/(context)/VotingContext';

interface Voter {
    id: string;
    name: string;
    hasVoted: boolean;
}

const summaryPage = () => {

    const { isLoading, error, uniqueVotes, fetchVoters } = useVotingContext();

    const [memberNames, setMemberNames] = useState<{[key: string]: string}>({});
    const [storeNumbers, setStoreNumbers] = useState<{[key: string]: string}>({});

    useEffect(() => {
        fetchVoters();
    }, []);

    useEffect(() => {
        const fetchMemberNames = async () => {
            const names: {[key: string]: string} = {};
            for (const vote of uniqueVotes) {
                const memberName = await getNamefromId(vote.member_id);
                if (memberName !== null) {
                    names[vote.member_id] = memberName;
                }
                console.log(names);
            }
            setMemberNames(names);
        };

        const fetchMemberStoreNumbers = async () => {
            const storeNumbers: {[key: string]: string} = {};
            for (const vote of uniqueVotes) {
                const storeNumber = await getStoreNumberfromId(vote.member_id);
                if (storeNumber !== null) {
                    storeNumbers[vote.member_id] = storeNumber;
                }
                console.log(storeNumbers);
            }
            setStoreNumbers(storeNumbers);
        };
        
        fetchMemberNames();
        fetchMemberStoreNumbers();
    }, [uniqueVotes]);



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='h-full bg-white'>
        <ScrollView>
            <CardHeader title={'Voter Summary'} />
            <View className='p-4'>
                <View className='border-2 px-4 mb-4 w-[40%] rounded-sm justify-center'>
                    <Text className='text-xl font-medium text-blue-600'>Date of Vote:
                        <Text className='text-xl font-semibold'>  {new Date().toLocaleDateString()}</Text>
                    </Text>
                </View>

                <View className='border-b-2 w-[85%] border-black' />
                <View className='flex-row'>
                    <View className='border-l-2 border-b-2 w-[5%] h-10 items-center justify-center' />

                    <View className='border-l-2 border-b-2 w-[25%] h-10 items-center justify-center'>
                        <Text className='text-lg font-bold text-blue-600'>STORE NUMBER</Text>
                    </View>
                    <View className='border-l-2 border-b-2 w-[35%] h-10 items-center justify-center'>
                        <Text className='text-lg font-bold text-blue-600'>FRANCHISEE NAME</Text>
                    </View>
                    <View className='border-l-2 border-b-2 border-r-2 w-[20%] items-center justify-center'>
                        <Text className='text-lg font-bold text-blue-600'>HAS VOTED</Text>
                    </View>
                </View>
                <FlatList 
                    data={uniqueVotes}
                    keyExtractor={(item) => item.member_id.toString()}
                    renderItem={({ item }) => (
                        <View className='flex-row'>
                            <View className='border-l-2 border-b-2 w-[5%] h-10 items-center justify-center'>
                                <Text>{uniqueVotes.indexOf(item) + 1}</Text>
                            </View>
                            <View className='border-l-2 border-b-2 w-[25%] h-10 justify-center items-center'>
                                <Text className='text-lg font-semibold'>{storeNumbers[item.member_id] || 'Loading...'}</Text>
                            </View>
                            <View className='border-l-2 border-b-2 w-[35%] h-10 justify-center items-center'>
                                <Text className='text-lg font-semibold'>{memberNames[item.member_id] || 'Loading...'}</Text>
                            </View>
                            <View className={`${item.has_voted.toString() === "true" ? 'bg-green-300' : 'bg-red-300'} border-l-2 border-b-2 border-r-2 w-[20%] items-center justify-center'`}>
                                <Text className='text-lg font-bold mt-1'>{item.has_voted.toString()}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default summaryPage