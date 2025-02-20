import { supabase } from '@/services/supabaseClient';
import { clearActiveCandidates } from './candidateAPI';

/**
 * -----------------------------
 * EVENT SCHEMA
 * -----------------------------
 * event_id (primary key)   
 * event_name: string       
 * event_date: Date         
 * created_by: string
 * is_open: boolean
 */

export interface Event {
    event_id: string;
    event_date: Date;            
    event_name: string;
    created_by: string;
    is_open: boolean;
}

/**
 * -----------------------------
 * 1. GET ALL EVENTS
 * -----------------------------
 * @returns {Promise<Event[]>} Array of all events
 * @throws {Error} If there's an error fetching the events
 */
export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select();

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 2. GET ONLY OPEN EVENTS
 * -----------------------------
 * @returns {Promise<Event[]>} Array of open events
 * @throws {Error} If there's an error fetching the open events
 */
export async function getOpenEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select()
    .eq('is_open', true);

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 3. GET LAST GENERAL MEETING
 * -----------------------------
 * @returns {Promise<Event[]>} Array containing the last general meeting event
 * @throws {Error} If there's an error fetching the last general meeting
 */
export async function getLastGeneralMeetingEvent(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select()
    .eq('event_name', 'GENERAL-MEETING')
    .order('event_date', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 4. GET LAST BOARD MEETING
 * -----------------------------
 * @returns {Promise<Event[]>} Array containing the last board meeting event
 * @throws {Error} If there's an error fetching the last board meeting
 */
export async function getLastBoardMeetingEvent(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select()
    .eq('event_name', 'BOARD-MEETING')
    .order('event_date', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 5. ADD A NEW EVENT
 * -----------------------------
 * @param {Event} event - Event Object to add
 * @returns {Promise<Event[]>} Array containing the newly created event
 * @throws {Error} If there's an error creating the event
 */
export async function insertNewEvent(event: Event): Promise<Event[]> {
  const isOpen = event.event_name === 'AUTO' ? false : true;

  const [lastGeneralMeeting, lastBoardMeeting] = await Promise.all([
    getLastGeneralMeetingEvent(),
    getLastBoardMeetingEvent()
  ]);

  if (event.event_name === 'GENERAL-MEETING') {
    if (!lastGeneralMeeting || !lastGeneralMeeting[0] || lastGeneralMeeting[0].is_open === false) {
      const { data, error } = await supabase
      .from('events')
      .insert([
        {
          event_name: event.event_name,
          event_date: event.event_date,
          created_by: 'ADMIN',
          is_open: isOpen,
        },
      ])
      .select();

      if (error) throw new Error(error.message);
      return data as Event[];
    }
  }
  else if (event.event_name === 'BOARD-MEETING') {
    if (!lastBoardMeeting || !lastBoardMeeting[0] || lastBoardMeeting[0].is_open === false) {
      const { data, error } = await supabase
      .from('events')
      .insert([
        {
          event_name: event.event_name,
          event_date: new Date(),
          created_by: 'ADMIN',
          is_open: isOpen,
        },
      ])
      .select();

      if (error) throw new Error(error.message);
      return data as Event[];
    }
  }
  else if (event.event_name === 'AUTO') {
    const { data, error } = await supabase
    .from('events')
    .insert([
      {
        event_name: event.event_name,
        event_date: new Date(),
        created_by: 'AUTO',
        is_open: isOpen,
      },
    ])
    .select();

    if (error) throw new Error(error.message);
    return data as Event[];
  }

  throw new Error('Invalid event type');
}

/**
 * -----------------------------
 * 6. CLOSE (TERMINATE) EVENT
 * -----------------------------
 * @param {string} eventName - Name of the event to terminate
 * @returns {Promise<Event[]>} Array containing the terminated event
 * @throws {Error} If there's an error terminating the event or if no open event exists
 * 
 * Need to add logic to reset active candidates, voting records, and check-in records. 
 * First test the summary data function. 
 * Then set up the Google Drive export function.
 * Finalize the export data schema
 * Ensure data integrity
 * Then reset the active candidates and voting records from database
 */
export async function terminateOpenEvent(eventName: string): Promise<Event[]> {
  const [lastBoardMeetingEvent, lastGeneralMeetingEvent] = await Promise.all([
    getLastBoardMeetingEvent(),
    getLastGeneralMeetingEvent()
  ]);

  if (!lastBoardMeetingEvent && !lastGeneralMeetingEvent) {
    console.log('There are no open events to terminate')
    throw new Error('There are no open events to terminate');
  }

  if (eventName === 'BOARD-MEETING') {
    if (lastBoardMeetingEvent && lastBoardMeetingEvent[0].is_open) {
      const { data, error } = await supabase
      .from('events')
      .update({
        is_open: false
      })
      .eq('event_id', lastBoardMeetingEvent[0].event_id)
      .select();

      if (error) throw new Error(error.message);
      return data as Event[];
    }
  }
  else if (eventName === 'GENERAL-MEETING') {
    // console.log('Start of termination')
    if (lastGeneralMeetingEvent && lastGeneralMeetingEvent[0].is_open) {
      // console.log('lastGeneralMeeting state works')
      // console.log(lastGeneralMeetingEvent[0])
      const { data, error } = await supabase
      .from('events')
      .update({
        is_open: false
      })
      .eq('event_id', lastGeneralMeetingEvent[0].event_id)
      .select();      

      if (error) throw new Error(error.message);
      return data as Event[];
    }
  }

  throw new Error('No open event of the specified type found');
}

/**
 * -----------------------------
 * 7. GET EVENT BY (NAME, DATE, CREATOR)
 * -----------------------------
 * @param {string} eventName - Name of the event
 * @param {Date} eventDate - Date of the event
 * @param {string} createdBy - Creator of the event
 * @returns {Promise<Event[]>} Array containing the matching event
 * @throws {Error} If there's an error fetching the event or if required parameters are missing
 */
export async function getEventById(
  eventName: string,
  eventDate: Date,
  createdBy: string
): Promise<Event[]> {
  if (!eventName || !eventDate || !createdBy) {
    throw new Error('Event name, event date, and created by are required');
  }

  const { data, error } = await supabase
    .from('events')
    .select()
    .eq('event_name', eventName)
    .eq('event_date', eventDate)
    .eq('created_by', createdBy);

  if (error) throw new Error(error.message);
  return data as Event[];
}