import { supabase } from '../utils/supabase';
import { getLastBoardMeetingEvent, getLastGeneralMeetingEvent } from './manageEvents';
import { createBoardCheckIn, createNewCheckIn } from './manageEvents';
import { idExists } from './manageMembers';

/*

    First check if the member exists
    Then go to the event table and check if an open event exists
    If so, check if the member has already checked in
        If not, create a new check in and assign the member id and event id
        If yes, just 

*/

export const insertCheckIn = async ({memberId}) => {
    try {
        // Check for empty parameters
        if (!memberId) {
            return { data: null, error: new Error('Member ID is required') };
        }

        // Ensure member ID exists
        const existingMemberId = await idExists(memberId);
        if (existingMemberId === null) {
            return { data: null, error: new Error('Member ID does not exist') };
        }
        
        // Priority to board meetings. If there is no board meeting, check for general meetings
        const boardMeeting = await getLastBoardMeetingEvent();

        // Ensure board meeting exists and is open
        if (boardMeeting.data && boardMeeting.data.status === true) {
            const existingBoardCheckIn = await supabase
            .from('board_check_in')
            .select()
            .eq('member_id', memberId)
            .eq('event_id', boardMeeting.data.event_id)
            .single();

            // Create new check in
            if (existingBoardCheckIn === null) {
                const boardCheckIn = await createBoardCheckIn(memberId, boardMeeting.data.event_id);
                return { data: boardCheckIn, error: null };
            } else {
                return { data: null, error: new Error('Member has already checked in')};
            }
        } else {
            const generalMeeting = await getLastGeneralMeetingEvent();

            // If general meeting does not exist, return an error
            if (generalMeeting.data === null) {
                return { data: null, error: new Error('New meeting has not been created. Please create a new meeting')};
            } 

            // If there is an open general meeting
            if (generalMeeting.data.status === true) {
                // Check if member has already checked in
                const existingCheckIn = await supabase
                .from('check_in')
                .select()
                .eq('member_id', memberId)
                .eq('event_id', generalMeeting.data.event_id)
                .single();

                // Create new check in
                if (existingCheckIn === null) {
                    const data = await createNewCheckIn(memberId, generalMeeting.data.event_id);
                    return { data, error: null };
                } else {
                    return { data: null, error: new Error('Member has already checked in')};
                }

            } else {
                return { data: null, error: new Error('Meeting is closed. Please create a new meeting')};
            }
        }
    } catch (error) {
        return { data: null, error };
    }
}
    


