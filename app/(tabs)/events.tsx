/* 
[] Design UX for event creation and termination
    CREATION
    - Event creation is very straightforward and manual.
    - Admin will initially either join an existing event or create a new meeting
    - A new event means there is no data in the session
    - An existing event means there are active candidates and the voting process is happening, moreover, the admin can terminate the session

    TERMINATION
    - Active sessions can either be manually terminated by the admin or automatically terminated after a certain amount of time

        MANUAL
        - If admin requests export of voting data, they get a notification that the session will be terminated.
            - Exports terminate the session
            - So provide other forms of data visualization and analysis dashboards so that admins can get a sense of progress

        AUTO
        - If the admin does not request export, the session will automatically terminate after a certain amount of time (24 hours)

        EXPORTS
            - The following data will be exported:
                - Checked In (Attendance) -- check_in table
                - Vote Tally -- active_candidates table
                - Unique Voters -- check_in table
                - Payment Records -- payments table
        
[] Design UI for event creation and termination
    USER FLOW
    - It would make sense for the admin page to initially direct to the Event Creation page
    - Then the admin will be able to either join an existing event or create a new meeting
        - For either option, there will be a dropdown of General Meetings and Board Meetings to choose from.
    - A new event means there is no data in the session
    - An existing event means there are active candidates and the voting process is happening, moreover, the admin can terminate the session

    - After a session is terminated, provide a two hour window where admin can 'join' the session that was just closed and get analytics straight on the device. Once that window is over, remove all data from local state and reset the UI to the default state
*/


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import CardHeader from '@/components/CardHeader';

import { useRouter } from 'expo-router';

import { 
    Event,
    getLastGeneralMeetingEvent,
    getLastBoardMeetingEvent,
} from '@/scripts/eventsAPI';

import { useEventContext } from '@/app/(context)/EventContext';
import { useCandidateContext } from '@/app/(context)/CandidateContext';
import { useVotingContext } from '../(context)/VotingContext';

// import { exportEventDataToGoogleDrive } from '@/scripts/exportToGoogleDrive';

const EventScreen = () => {
    const {
        events,
        currEvent,
        isLoading, 
        error,
        fetchOpenEvents,
        checkInEvent,
        addEvent,
        closeEvent,
    } = useEventContext();
    const { summary, summarizeData } = useCandidateContext();
    const { fetchVoters, fetchCheckedIn } = useVotingContext();

    const [tempEventData, setTempEventData] = useState<Event | null>(null); // Will use this for degrading UI later.

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [driveLoading, setDriveLoading] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'join' | 'terminate'>('create');
    const [openGeneralMeeting, setOpenGeneralMeeting] = useState<Event | null>(null);
    const [openBoardMeeting, setOpenBoardMeeting] = useState<Event | null>(null);

    const router = useRouter();

    useEffect(() => {
        fetchOpenEvents();
    }, []);

    useEffect(() => {
        const checkOpenMeetings = async () => {
            const lastGeneral = await getLastGeneralMeetingEvent();
            const lastBoard = await getLastBoardMeetingEvent();
            setOpenGeneralMeeting(lastGeneral[0] && lastGeneral[0].is_open ? lastGeneral[0] : null);
            setOpenBoardMeeting(lastBoard[0] && lastBoard[0].is_open ? lastBoard[0] : null);
        };
        checkOpenMeetings();
    }, [events]);

    const handleCreateEvent = async (eventType: 'GENERAL-MEETING' | 'BOARD-MEETING') => {
        try {
            const newEvent = await addEvent({ event_id: '', event_name: eventType, event_date: new Date(), created_by: 'Admin', is_open: true });

            if (!newEvent) {
                throw new Error('Failed to create event');
            }

            await checkInEvent(newEvent);
            setIsModalVisible(false);
            router.push('/admin');
        } catch (error) {
            console.error(`Failed to create ${eventType}:`, error);
        }
    };

    const handleJoinEvent = async (event: Event) => {
        try {
            await checkInEvent(event);
            setIsModalVisible(false);
            router.push('/admin');
        } catch (error) {
            console.error(`Failed to join ${event.event_name}:`, error);
        }
    };

    const handleTerminateEvent = async (event: Event) => {
        try {
            setDriveLoading(true);

            // Summary Data
            const summaryData = await summarizeData(); // Active candidates and vote count
            const votersData = await fetchVoters(); // Unique voters
            const attendanceData = await fetchCheckedIn(); // Attendance

            if (!summaryData || !votersData || !attendanceData) {
                throw new Error('Failed to fetch required data for export');
            }

            // Convert event_date to proper Date object if it's a string
            const eventDate = event.event_date instanceof Date ? event.event_date : new Date(event.event_date);

            // // Export to Google Drive
            // const exportSuccess = await exportEventDataToGoogleDrive(
            //     eventDate,
            //     event.event_name,
            //     {
            //         attendance: attendanceData,
            //         uniqueVoters: votersData,
            //         activeCandidates: summaryData
            //     }
            // );

            // if (!exportSuccess) {
            //     throw new Error('Failed to verify Google Drive export');
            // }

            // Terminate Event
            await closeEvent(event);
            setIsModalVisible(false);
            console.log('Event terminated and data exported successfully.');
            
            // Show success message
            Alert.alert(
                'Success',
                'Event terminated and data exported to Google Drive successfully.',
                [{ text: 'OK', onPress: () => router.push('/') }]
            );
        } catch (error) {
            console.error('Error terminating event:', error);
            Alert.alert(
                'Error',
                `Failed to terminate event: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        } finally {
            setDriveLoading(false);
        }
    };

  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView className="h-full justify-center bg-white">
      <ScrollView className="p-6">
        <CardHeader title="Meetings" />
        <View className="ml-4 mt-2">
          <TouchableOpacity
            className="rounded-lg p-4 border px-6 border-gray-400 w-[500px] mb-4"
            onPress={() => {
              setModalType('create')
              setIsModalVisible(true)
            }}
          >
            <Text className="font-semibold text-2xl">Create Meeting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg p-4 border px-6 border-gray-400 w-[500px] mb-4"
            onPress={() => {
              setModalType('join')
              setIsModalVisible(true)
            }}
          >
            <Text className="font-semibold text-2xl">Join Meeting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg p-4 border px-6 border-gray-400 w-[500px] mb-4"
            onPress={() => {
              setModalType('terminate')
              setIsModalVisible(true)
            }}
          >
            <Text className="font-semibold text-2xl">Terminate Meeting</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isModalVisible} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-xl w-5/6 max-w-md border border-gray-100">
              {modalType === 'create' && (
                <>
                  <Text className="text-xl font-semibold mb-4 text-gray-800">Create Meeting</Text>
                  {!openGeneralMeeting && (
                    <TouchableOpacity
                      className="rounded-lg bg-green-700 p-3 px-5 mb-4 border border-gray-600"
                      onPress={() => handleCreateEvent('GENERAL-MEETING')}
                    >
                      <Text className="text-gray-200 font-semibold text-xl">Create General Meeting</Text>
                    </TouchableOpacity>
                  )}
                  {openGeneralMeeting && (
                    <View className='rounded-lg bg-red-600 p-3 px-5 mb-4 border-2 border-gray-300'>
                        <Text className="text-gray-100 font-semibold text-xl">General Meeting is Ongoing</Text>
                    </View>
                  )}
                  {!openBoardMeeting && (
                    <TouchableOpacity
                      className="rounded-lg bg-green-700 p-3 px-5 mb-4 border-0.5 border-gray-100"
                      onPress={() => handleCreateEvent('BOARD-MEETING')}
                    >
                      <Text className="text-gray-200 font-semibold text-xl">Create Board Meeting</Text>
                    </TouchableOpacity>
                  )}
                  {openBoardMeeting && (
                    <View className='rounded-lg bg-red-600 p-3 px-5 mb-4 border-2 border-gray-300'>
                        <Text className="text-gray-100 font-semibold text-xl">Board Meeting is Ongoing</Text>
                    </View>
                  )}
                </>
              )}
              {modalType === 'join' && (
                <>
                  <Text className="text-xl font-semibold mb-4 text-gray-800">Join Meeting</Text>
                  {openGeneralMeeting && (
                    <TouchableOpacity
                      className="bg-green-700 rounded-lg p-3 px-5 mb-4"
                      onPress={() => handleJoinEvent(openGeneralMeeting)}
                    >
                      <Text className="text-gray-200 font-semibold text-xl">Join General Meeting</Text>
                    </TouchableOpacity>
                  )}
                  {openBoardMeeting && (
                    <TouchableOpacity
                      className="bg-green-700 rounded-lg p-3 px-5 mb-4"
                      onPress={() => handleJoinEvent(openBoardMeeting)}
                    >
                      <Text className="text-gray-200 font-semibold text-xl">Join Board Meeting</Text>
                    </TouchableOpacity>
                  )}
                  {!openGeneralMeeting && !openBoardMeeting && (
                    <View className='bg-red-600 p-4 mb-4 rounded-lg border-2 border-gray-300'>
                        <Text className="text-gray-100 text-xl font-semibold">No Open Meetings Available.</Text>
                    </View>
                  )}
                </>
              )}
              {modalType === 'terminate' && (
                <>
                  <Text className="text-xl font-semibold mb-4 text-gray-800">Terminate Meeting</Text>
                  {openGeneralMeeting && (
                    <TouchableOpacity
                      className="bg-green-700 rounded-lg p-3 mb-4 border border-gray-100"
                      onPress={() => handleTerminateEvent(openGeneralMeeting)}
                    >
                      <Text className="text-gray-200 font-semibold text-xl">Terminate General Meeting</Text>
                    </TouchableOpacity>
                  )}
                  {openBoardMeeting && (
                    <TouchableOpacity
                      className="bg-green-700 rounded-lg p-3 mb-4 border border-gray-100"
                      onPress={() => handleTerminateEvent(openBoardMeeting)}
                    >
                      <Text className="text-gray-200 font-semibold text-xl">Terminate Board Meeting</Text>
                    </TouchableOpacity>
                  )}
                  {!openGeneralMeeting && !openBoardMeeting && (
                    <View className='bg-red-600 p-4 mb-4 rounded-lg border-2 border-gray-300'>
                        <Text className="text-gray-100 text-xl font-semibold">No Open Meetings Available.</Text>
                    </View>
                  )}
                </>
              )}
              <TouchableOpacity
                className="mt-2 bg-gray-100 rounded-lg p-3 border border-gray-700"
                onPress={() => setIsModalVisible(false)}
              >
                <Text className="text-gray-600 font-semibold text-xl text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  </GestureHandlerRootView>
);
}

export default EventScreen;