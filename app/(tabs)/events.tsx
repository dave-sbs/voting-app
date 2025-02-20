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
  Alert,
  ActivityIndicator
} from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardHeader from '@/components/CardHeader';
import { useRouter } from 'expo-router';
import { 
    Event,
    getLastGeneralMeetingEvent,
    getLastBoardMeetingEvent,
} from '@/scripts/API/eventsAPI';
import { useEventContext } from '@/app/(context)/EventContext';
import { useCandidateContext } from '@/app/(context)/CandidateContext';
import { useVotingContext } from '../(context)/VotingContext';

// import { exportEventDataToGoogleDrive } from '@/scripts/exportToGoogleDrive';

const EventScreen = () => {
    const {
        isLoading, 
        error,
        fetchOpenEvents,
        getLastGeneralMeeting,
        getLastBoardMeeting,
        checkInEvent,
        addEvent,
        closeEvent,
    } = useEventContext();
    const { 
      summary, 
      summarizeData, 
      clearCandidatesTable
    } = useCandidateContext();
    const { 
      fetchVoters, 
      fetchCheckedIn,
      resetCheckInTable
    } = useVotingContext();

    const [tempEventData, setTempEventData] = useState<Event | null>(null); // Will use this for degrading UI later.
    const [currEventState, setCurrEventState] = useState<'open' | 'closed'>('open');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [driveLoading, setDriveLoading] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'join' | 'terminate'>('create');
    const [openGeneralMeeting, setOpenGeneralMeeting] = useState<Event | null>(null);
    const [openBoardMeeting, setOpenBoardMeeting] = useState<Event | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    
    // Add state for feedback modal
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

    const router = useRouter();

    useEffect(() => {
        const checkOpenMeetings = async () => {
            const lastGeneral = await getLastGeneralMeeting();
            const lastBoard = await getLastBoardMeeting();
            if (!lastGeneral || !lastBoard) return;
            setOpenGeneralMeeting(lastGeneral[0] && lastGeneral[0].is_open ? lastGeneral[0] : null);
            setOpenBoardMeeting(lastBoard[0] && lastBoard[0].is_open ? lastBoard[0] : null);
        };
        checkOpenMeetings();
        fetchOpenEvents();
    }, [currEventState]);

    const handleCreateEvent = async (eventType: 'GENERAL-MEETING' | 'BOARD-MEETING') => {
        try {
            const newEvent = await addEvent({ event_id: '', event_name: eventType, event_date: new Date(), created_by: 'Admin', is_open: true });
            if (!newEvent) {
                throw new Error('Failed to create event');
            }
            await checkInEvent(newEvent);
            setFeedbackType('success');
            setFeedbackMessage(`Successfully created ${eventType}`);
            setShowFeedbackModal(true);
            setIsModalVisible(false);
            setTimeout(() => {
                setShowFeedbackModal(false);
                router.push('/admin');
            }, 2000);
        } catch (error) {
            setFeedbackType('error');
            setFeedbackMessage(`Failed to create ${eventType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowFeedbackModal(true);
        }
    };

    const handleJoinEvent = async (event: Event) => {
        try {
            await checkInEvent(event);
            setTimeout(() => {
            setIsModalVisible(false);
            router.push('/admin');
            }, 2000);
        } catch (error) {
            setStatusMessage(`Failed to join ${event.event_name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleTerminateEvent = async (event: Event) => {
        try {
            setDriveLoading(true);
            // Summary Data
            const summaryData = await summarizeData(); 
            const votersData = await fetchVoters(); 
            const attendanceData = await fetchCheckedIn(); 

            if (!summaryData || !votersData || !attendanceData) {
                throw new Error('Failed to fetch required data for export');
            }

            // Prepare the export data
            const exportData = {
                eventInfo: {
                    name: event.event_name,
                    date: event.event_date,
                    status: event.created_by
                },
                summary: summaryData,
                voters: votersData,
                attendance: attendanceData
            };

            console.log('Sending data to export endpoint:', exportData);
            
            try {
                // Send data to export endpoint
                const response = await fetch('http://localhost:3000/export', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(exportData)
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server error response:', errorText);
                    throw new Error(`Server responded with ${response.status}: ${errorText}`);
                }
            } catch (error) {
                console.error('Fetch error details:', error);
                throw error;
            }
            
            setDriveLoading(false);
            setFeedbackType('success');
            setIsModalVisible(false);
            setFeedbackMessage(`Successfully terminated ${event.event_name}`);
            setShowFeedbackModal(true);
            setTimeout(() => {
                setShowFeedbackModal(false);
            }, 2000);
            // Terminate Event
            await closeEvent(event);
            await clearCandidatesTable();
            await resetCheckInTable();
            setCurrEventState('closed');
        } catch (error) {
            setFeedbackType('error');
            setFeedbackMessage(`Failed to terminate event: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowFeedbackModal(true);
            setTimeout(() => {
                setShowFeedbackModal(false);
            }, 2500);
        } finally {
            setDriveLoading(false);
        }
    };

  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView className="h-full justify-center bg-white">
      <ScrollView className="py-6">
        <CardHeader title="Meetings"/>
        <View className="ml-4 mt-6">
          <TouchableOpacity
            className={`rounded-lg p-4 border px-6 border-gray-400 w-[500px] mb-4 ${isLoading ? 'opacity-50' : ''}`}
            onPress={() => {
              setModalType('create')
              setIsModalVisible(true)
            }}
            disabled={isLoading}
          >

            {/* Choose Action Buttons */}
            <Text className="font-semibold text-2xl">Create Meeting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`rounded-lg p-4 border px-6 border-gray-400 w-[500px] mb-4 ${isLoading ? 'opacity-50' : ''}`}
            onPress={() => {
              setModalType('join')
              setIsModalVisible(true)
            }}
            disabled={isLoading}
          >
            <Text className="font-semibold text-2xl">Join Meeting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`rounded-lg p-4 border px-6 border-gray-400 w-[500px] mb-4 ${isLoading ? 'opacity-50' : ''}`}
            onPress={() => {
              setModalType('terminate')
              setIsModalVisible(true)
            }}
            disabled={isLoading}
          >
            <Text className="font-semibold text-2xl">Terminate Meeting</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isModalVisible} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-xl w-5/6 max-w-md border border-gray-100">
              {error && (
                <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
                  <Text className="text-red-700">{error}</Text>
                </View>
              )}

              {/* Create Meeting Variants */}
              {modalType === 'create' && (
                <>
                  <Text className="text-xl font-semibold mb-4 text-gray-800">Create Meeting</Text>
                  {!openGeneralMeeting ? (
                    openBoardMeeting ? (
                      <View className='rounded-lg bg-red-600 p-3 px-5 mb-4 border-2 border-gray-300'>
                          <Text className="text-gray-100 font-semibold text-xl">To Create General Meeting,</Text>
                          <Text className='text-gray-100 font-semibold text-xl pt-1'>Please Close Board Meeting First</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        className={`rounded-lg bg-green-800 p-3 px-5 mb-4 border-0.5 border-gray-100 ${isLoading ? 'opacity-50' : ''}`}
                        onPress={() => handleCreateEvent('GENERAL-MEETING')}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#475569" />
                        ) : (
                          <Text className="text-gray-200 font-semibold text-xl">Create General Meeting</Text>
                        )}
                      </TouchableOpacity>
                    )
                  ) : (
                    <View className='rounded-lg bg-red-600 p-3 px-5 mb-4 border-2 border-gray-300'>
                        <Text className="text-gray-100 font-semibold text-xl">General Meeting is Ongoing</Text>
                    </View>
                  )}
                  
                  {!openBoardMeeting ? (
                    openGeneralMeeting ? (
                      <View className='rounded-lg bg-red-600 p-3 px-5 mb-4 border-2 border-gray-300'>
                          <Text className="text-gray-100 font-semibold text-xl">To Create Board Meeting,</Text>
                          <Text className='text-gray-100 font-semibold text-xl pt-1'>Please Close General Meeting First</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        className={`rounded-lg bg-green-800 p-3 px-5 mb-4 border-0.5 border-gray-100 ${isLoading ? 'opacity-50' : ''}`}
                        onPress={() => handleCreateEvent('BOARD-MEETING')}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#475569" />
                        ) : (
                          <Text className="text-gray-200 font-semibold text-xl">Create Board Meeting</Text>
                        )}
                      </TouchableOpacity>
                    )
                  ) : (
                    <View className='rounded-lg bg-red-600 p-3 px-5 mb-4 border-2 border-gray-300'>
                        <Text className="text-gray-100 font-semibold text-xl">Board Meeting is Ongoing</Text>
                    </View>
                  )}
                </>
              )}

              {/* Join Meeting Variants */}
              {modalType === 'join' && (
                <>
                  <Text className="text-xl font-semibold mb-4 text-gray-800">Join Meeting</Text>
                  {openGeneralMeeting && (
                    <TouchableOpacity
                      className={`bg-green-800 rounded-lg p-3 px-5 mb-4 ${isLoading ? 'opacity-50' : ''}`}
                      onPress={() => handleJoinEvent(openGeneralMeeting)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#475569" />
                      ) : (
                        <Text className="text-gray-200 font-semibold text-xl">Join General Meeting</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  {openBoardMeeting && (
                    <TouchableOpacity
                      className={`bg-green-800 rounded-lg p-3 px-5 mb-4 ${isLoading ? 'opacity-50' : ''}`}
                      onPress={() => handleJoinEvent(openBoardMeeting)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#475569" />
                      ) : (
                        <Text className="text-gray-200 font-semibold text-xl">Join Board Meeting</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  {!openGeneralMeeting && !openBoardMeeting && (
                    <View className='bg-red-600 p-4 mb-4 rounded-lg border-2 border-gray-300'>
                        <Text className="text-gray-100 text-xl font-semibold">No Open Meetings Available.</Text>
                    </View>
                  )}
                </>
              )}

              {/* Terminate Meeting Variants */}
              {modalType === 'terminate' && (
                <>
                  <Text className="text-xl font-semibold mb-4 text-gray-800">Terminate Meeting</Text>
                  {openGeneralMeeting && (
                    <TouchableOpacity
                      className={`bg-green-800 rounded-lg p-3 mb-4 border border-gray-100 ${isLoading || driveLoading ? 'opacity-50' : ''}`}
                      onPress={() => handleTerminateEvent(openGeneralMeeting)}
                      disabled={isLoading || driveLoading}
                    >
                      {(isLoading || driveLoading) ? (
                        <ActivityIndicator color="#475569" />
                      ) : (
                        <Text className="text-gray-200 font-semibold text-xl">Terminate General Meeting</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  {openBoardMeeting && (
                    <TouchableOpacity
                      className={`bg-green-800 rounded-lg p-3 mb-4 border border-gray-100 ${isLoading || driveLoading ? 'opacity-50' : ''}`}
                      onPress={() => handleTerminateEvent(openBoardMeeting)}
                      disabled={isLoading || driveLoading}
                    >
                      {(isLoading || driveLoading) ? (
                        <ActivityIndicator color="#475569" />
                      ) : (
                        <Text className="text-gray-200 font-semibold text-xl">Terminate Board Meeting</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  {!openGeneralMeeting && !openBoardMeeting && (
                    <View className='bg-red-600 p-4 mb-4 rounded-lg border-2 border-gray-300'>
                        <Text className="text-gray-100 text-xl font-semibold">No Open Meetings Available.</Text>
                    </View>
                  )}
                </>
              )}
              {statusMessage && (
                <View className={`p-3 rounded-lg mb-4 ${statusMessage.includes('Successfully') ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Text className={statusMessage.includes('Successfully') ? 'text-green-800' : 'text-red-700'}>{statusMessage}</Text>
                </View>
              )}
              <TouchableOpacity
                className="bg-gray-200 rounded-lg p-3"
                onPress={() => {
                  setIsModalVisible(false)
                  setStatusMessage('')
                }}
                disabled={isLoading || driveLoading}
              >
                <Text className="text-center text-gray-800 font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Feedback Modal */}
        <Modal visible={showFeedbackModal} animationType="slide" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className={`bg-white p-6 rounded-xl w-5/6 max-w-md border ${feedbackType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
              <View className={`${feedbackType === 'success' ? 'bg-green-100' : 'bg-red-100'} p-4 rounded-lg`}>
                <Text className={`text-xl font-semibold ${feedbackType === 'success' ? 'text-green-800' : 'text-red-700'}`}>
                  {feedbackType === 'success' ? '✓ Success' : '✕ Error'}
                </Text>
                <Text className={`mt-2 ${feedbackType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {feedbackMessage}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default EventScreen;