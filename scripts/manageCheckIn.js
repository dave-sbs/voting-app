import { supabase } from '../utils/supabase';
import { getLastBoardMeetingEvent, getLastGeneralMeetingEvent } from './manageEvents';
import { createBoardCheckIn, createGeneralCheckIn, updateBoardCheckIn, updateGeneralCheckIn } from './manageEvents';
import { idExists } from './manageMembers';

/*

    First check if the member exists
    Then go to the event table and check if an open event exists
        Check whether it is general or board. For selected meeting
            If so, check if the member has already checked in
                If not, create a new check in and assign the member id and event id
                If yes, just call the update check in function to update the check in time
    If no open event, return an error
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

        // Ensure there is an open meeting
        const openMeetings = await getOpenEvents();
        if (openMeetings.data.length === 0) {
            return { data: null, error: new Error('There are no open meetings available. Please create a new meeting') };
        }

        // Priority to board meetings. If there is no board meeting, check for general meetings
        const boardMeeting = await getLastBoardMeetingEvent();

        // Ensure board meeting exists and is open
        if (boardMeeting.data && boardMeeting.data.is_open) {
            const existingBoardCheckIn = await supabase
            .from('board_check_in')
            .select()
            .eq('member_id', memberId)
            .eq('event_id', boardMeeting.data.event_id)
            .single();

            console.log(existingBoardCheckIn);

            // Create new check in
            if (existingBoardCheckIn === null) {
                const boardCheckIn = await createBoardCheckIn(memberId, boardMeeting.data.event_id);
                return { data: boardCheckIn, error: null };
            } else {
                const updatedCheckIn = await updateBoardCheckIn(memberId, boardMeeting.data.event_id);
                return { data: updatedCheckIn, error: null };
            }
        } else {
            const generalMeeting = await getLastGeneralMeetingEvent();

            // If there is an open general meeting - If there is no open board meeting and we already have an open meeting then it has to be general. We just gotta make sure the coding logic above is bullet proof.
            // if (generalMeeting.data.is_open) {
            //     // Check if member has already checked in
            //     const existingCheckIn = await supabase
            //     .from('check_in')
            //     .select()
            //     .eq('member_id', memberId)
            //     .eq('event_id', generalMeeting.data.event_id)
            //     .single();

            // Create new check in
            if (existingCheckIn === null) {
                const data = await createGeneralCheckIn(memberId, generalMeeting.data.event_id);
                return { data, error: null };
            } else {
                const updatedCheckIn = await updateGeneralCheckIn(memberId, generalMeeting.data.event_id);
                return { data: updatedCheckIn, error: null };
            }
        }
    } catch (error) {
        return { data: null, error };
    }
}
    


