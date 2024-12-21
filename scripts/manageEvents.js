import { insertEvent, getAllEvents, getLastBoardMeetingEvent, getLastGeneralMeetingEvent, terminateEvent, getOpenEvents } from '../scripts/table_functions/eventTableFunctions.js';

/*
It currently allows events with the same data to be duplicated. Need to fix
If a board meeting session is already open, don't allow another one to be created. 
Same for a general meeting.

-- An action I have to add is to check if a meeting has been opened for more than 24 hours and close it automatically, send the report to the drive.
*/

export const manageEvents = async ( {meetingName, action} ) => {
    const { data: allEvents, error: allEventsError } = await getAllEvents();
    const { data: lastBoardEvent, error: lastBoardEventError } = await getLastBoardMeetingEvent();
    const { data: lastGeneralEvent, error: lastGeneralEventError } = await getLastGeneralMeetingEvent();

    if (allEventsError || lastBoardEventError || lastGeneralEventError) {
        throw new Error("Failed to fetch event data");
      }

    if (action === 'open'){
        // Create General Meeting if it doesn't exist or is closed
        if (meetingName === 'General Meeting') {
            if (!lastGeneralEvent || lastGeneralEvent[0].is_open === false) {
                const { data: generalMeeting, error: generalMeetingError } = await insertEvent({
                    eventName: 'General Meeting',
                    eventDate: new Date(),
                    createdBy: 'ADMIN'
                });
                if (generalMeetingError) {
                    console.log(generalMeetingError);
                    return;
                }
            }
        }

        // Create Board Meeting if it doesn't exist or is closed
        else if (meetingName === 'Board Meeting') {
            if (!lastBoardEvent || lastBoardEvent[0].is_open === false) {
                const { data: boardMeeting, error: boardMeetingError } = await insertEvent({
                    eventName: 'Board Meeting',
                    eventDate: new Date(),
                    createdBy: 'ADMIN'
                });
                if (boardMeetingError) {
                    console.log(boardMeetingError);
                    return;
                }
            }
        }

        else if (meetingName === 'AUTO') {
            const { data: autolMeeting, error: autoMeetingError } = await insertEvent({
                eventName: 'AUTO',
                eventDate: new Date(),
                createdBy: 'AUTO'
            });
            if (autoMeetingError) {
                console.log(autoMeetingError);
                return;
            }
        }
    } 
    
    // Close Meetings that are currently active
    else {
        if (meetingName === 'General Meeting' && lastGeneralEvent[0].is_open === true) {
            const { data: closedMeeting, error: closedMeetingError } = await terminateEvent({
                eventName: 'General Meeting',
                eventDate: lastGeneralEvent[0].event_date,
                createdBy: 'ADMIN'
            });
            if (closedMeetingError) {
                console.log(closedMeetingError);
                return;
            }
        } else if (meetingName === 'Board Meeting' && lastBoardEvent[0].is_open === true) {
            const { data: closedMeeting, error: closedMeetingError } = await terminateEvent({
                eventName: 'Board Meeting',
                eventDate: lastBoardEvent[0].event_date,
                createdBy: 'ADMIN'
            });
            if (closedMeetingError) {
                console.log(closedMeetingError);
                return;
            }
        }
    }
};