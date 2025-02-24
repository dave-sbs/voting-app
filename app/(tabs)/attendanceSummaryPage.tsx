import { FlatList, SafeAreaView, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CardHeader from '@/components/CardHeader'

import { useVotingContext } from '@/app/(context)/VotingContext'
import { useMemberContext } from '../(context)/MemberContext'
import { useEventContext } from '../(context)/EventContext'

interface AttendanceData {
    member_id: string
    name: string
    store_number: string[]
    checked_in: boolean
}

const AttendanceSummaryPage = () => {
    const { isLoading, error, fetchCheckedIn } = useVotingContext()
    const { currEvent, fetchOpenEvents } = useEventContext()
    const { members, fetchMembers } = useMemberContext()
    const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
    const [attendanceCount, setAttendanceCount] = useState(0)

    useEffect(() => {
        const initializeAttendanceData = async () => {
            const allMembers = await fetchMembers()
            const checkedInMembers = await fetchCheckedIn()

            if (allMembers && checkedInMembers) {
                const data = allMembers.map(member => ({
                    member_id: member.member_id,
                    name: member.member_name,
                    store_number: member.store_number,
                    checked_in: checkedInMembers.some(cm => cm.name === member.member_name)
                }))

                data.sort((a, b) => Number(b.checked_in) - Number(a.checked_in))
                setAttendanceData(data)
                setAttendanceCount(checkedInMembers.length)
            }
        }

        initializeAttendanceData()
        fetchOpenEvents()
    }, [fetchMembers, fetchCheckedIn])

    if (isLoading) return <Text>Loading...</Text>
    if (error) return <Text>Error: {error}</Text>

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className='h-full bg-white'>
                <ScrollView>
                    <CardHeader title='Attendance Summary' />
                    <View className='p-4'>
                        <View className='border-2 px-4 mb-4 w-[40%] rounded-sm justify-center'>
                            <Text className='text-xl font-medium text-blue-600'>
                                Date of Vote:
                                <Text className='text-xl font-semibold'> {new Date().toLocaleDateString()}</Text>
                            </Text>
                        </View>

                        <View className='p-2'>
                            <Text className='text-lg font-semibold'>
                                Current Meeting Session: <Text className='text-blue-600'>{currEvent?.event_name}</Text>
                            </Text>
                        </View>

                        <View className='p-2 mb-4'>
                            <Text className='text-lg font-semibold'>
                                Total Attendees: <Text className='text-blue-600'>{attendanceCount}</Text>
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
                                <Text className='text-lg font-bold text-blue-600'>CHECKED IN</Text>
                            </View>
                        </View>
                        <FlatList 
                            data={attendanceData}
                            keyExtractor={(item) => item.member_id}
                            renderItem={({ item, index }) => (
                                <View className='flex-row'>
                                    <View className='border-l-2 border-b-2 w-[5%] h-10 items-center justify-center'>
                                        <Text>{index + 1}</Text>
                                    </View>
                                    <View className='border-l-2 border-b-2 w-[25%] h-10 justify-center items-center'>
                                        <Text className='text-lg font-semibold'>{item.store_number}</Text>
                                    </View>
                                    <View className='border-l-2 border-b-2 w-[35%] h-10 justify-center items-center'>
                                        <Text className='text-lg font-semibold'>{item.name}</Text>
                                    </View>
                                    <View className={`${item.checked_in ? 'bg-green-300' : 'bg-red-300'} border-l-2 border-b-2 border-r-2 w-[20%] items-center justify-center`}>
                                        <Text className='text-lg font-bold'>{item.checked_in ? 'Yes' : 'No'}</Text>
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

export default AttendanceSummaryPage