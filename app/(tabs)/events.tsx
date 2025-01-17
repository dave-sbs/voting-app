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

const EventScreen = () => {
    const {
        events,
        currEvent,
        isLoading, 
        error,
        fetchOpenEvents,
        checkInEvent,
        addEvent,
        closeEvent
    } = useEventContext();
    const { summary, summarizeData } = useCandidateContext();
    const { fetchVoters, fetchCheckedIn } = useVotingContext();

    const [tempEventData, setTempEventData] = useState<Event | null>(null); // Will use this for degrading UI later.

    const [isModalVisible, setIsModalVisible] = useState(false);
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
            await summarizeData();
            await fetchVoters();
            await fetchCheckedIn();
            await closeEvent(event);
            setIsModalVisible(false);
            console.log('Event terminated successfully.');
            router.push('/');
        } catch (error) {
            console.error(`Failed to terminate ${event.event_name}:`, error);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className='h-full bg-white'>
                <ScrollView>
                    <CardHeader title={'Events Page'} />
                    <View>
                        <TouchableOpacity onPress={() => { setModalType('create'); setIsModalVisible(true); }}>
                            <Text>Create a New Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setModalType('join'); setIsModalVisible(true); }}>
                            <Text>Join an Existing Event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setModalType('terminate'); setIsModalVisible(true); }}>
                            <Text>Terminate an Existing Event</Text>
                        </TouchableOpacity>
                        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                                    {modalType === 'create' ? (
                                        <>
                                            <Text>Select Event Type:</Text>
                                            {!openGeneralMeeting && (
                                                <TouchableOpacity onPress={() => handleCreateEvent('GENERAL-MEETING')}>
                                                    <Text>General Meeting</Text>
                                                </TouchableOpacity>
                                            )}
                                            {openGeneralMeeting && (
                                                <Text>A general meeting is already open. Please close it before creating a new one</Text>
                                            )}
                                            {!openBoardMeeting && (
                                                <TouchableOpacity onPress={() => handleCreateEvent('BOARD-MEETING')}>
                                                    <Text>Board Meeting</Text>
                                                </TouchableOpacity>
                                            )}
                                            {openBoardMeeting && (
                                                <Text>A board meeting is already open. Please close it before creating a new one</Text>
                                            )}
                                            {openGeneralMeeting && openBoardMeeting && (
                                                <Text>First close already opened meetings</Text>
                                            )}
                                        </>
                                    ) : modalType === 'join' ? (
                                        <>
                                            <Text>Select Event to Join:</Text>
                                            {openGeneralMeeting && (
                                                <TouchableOpacity onPress={() => handleJoinEvent(openGeneralMeeting)}>
                                                    <Text>General Meeting</Text>
                                                </TouchableOpacity>
                                            )}
                                            {openBoardMeeting && (
                                                <TouchableOpacity onPress={() => handleJoinEvent(openBoardMeeting)}>
                                                    <Text>Board Meeting</Text>
                                                </TouchableOpacity>
                                            )}
                                            {!openGeneralMeeting && !openBoardMeeting && (
                                                <Text>No open meetings available</Text>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Text>Select Event to Terminate:</Text> 
                                            {openGeneralMeeting && (
                                                <TouchableOpacity onPress={() => handleTerminateEvent(openGeneralMeeting)}>
                                                    <Text>General Meeting</Text>
                                                </TouchableOpacity>
                                            )}
                                            {openBoardMeeting && (
                                                <TouchableOpacity onPress={() => handleTerminateEvent(openBoardMeeting)}>
                                                    <Text>Board Meeting</Text>
                                                </TouchableOpacity>
                                            )}
                                            {!openGeneralMeeting && !openBoardMeeting && (
                                                <Text>No open meetings available</Text>
                                            )}
                                        </>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default EventScreen;