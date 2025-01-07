import { supabase } from '@/services/supabaseClient';

/**
 * -----------------------------
 * EVENT SCHEMA (example)
 * -----------------------------
 * event_id (primary key)   
 * event_name: string       
 * event_date: Date         
 * created_by: string
 * is_open: boolean
 */

export interface Event {
    event_id?: string;
    event_name: string;
    event_date: Date;            
    created_by: string;
    is_open: boolean;
}

/**
 * -----------------------------
 * 1. GET ALL EVENTS
 * -----------------------------
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
 */
export async function getLastGeneralMeetingEvent(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select()
    .eq('event_name', 'General Meeting')
    .order('event_date', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 4. GET LAST BOARD MEETING
 * -----------------------------
 */
export async function getLastBoardMeetingEvent(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select()
    .eq('event_name', 'Board Meeting')
    .order('event_date', { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 5. ADD A NEW EVENT
 * -----------------------------
 * The 'eventName', 'eventDate', 'createdBy' correspond
 * to the partial arguments for an 'Event' row.
 * 
 * If 'eventName' === 'AUTO', we assume is_open = false;
 * otherwise is_open = true.
 */
export async function addEvent(
  eventName: string,
  eventDate: Date,
  createdBy: string
): Promise<Event[]> {
  const isOpen = eventName === 'AUTO' ? false : true;
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        event_name: eventName,
        event_date: eventDate,
        created_by: createdBy,
        is_open: isOpen,
      },
    ])
    .select();

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 6. CLOSE (TERMINATE) EVENT
 * -----------------------------
 * Marks an event's 'is_open' = false
 */
export async function closeEvent(eventId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .update({ is_open: false })
    .eq('event_id', eventId)
    .select();

  if (error) throw new Error(error.message);
  return data as Event[];
}

/**
 * -----------------------------
 * 7. GET EVENT BY (NAME, DATE, CREATOR)
 * -----------------------------
 * This is used to find an event that matches all 3 columns.
 */
async function getEventById(
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

// /**
//  * -----------------------------
//  * 8. INSERT EVENT (PUBLIC API)
//  * -----------------------------
//  * This wraps 'addEvent' with error handling and
//  * optional validations.
//  */
// export async function insertEvent({
//   eventName,
//   eventDate,
//   createdBy,
// }: {
//   eventName: string;
//   eventDate: Date;   // or string
//   createdBy: string;
// }): Promise<{ data: Event[] | null; error: Error | null }> {
//   try {
//     // Basic checks
//     if (!eventName || !eventDate || !createdBy) {
//       return {
//         data: null,
//         error: new Error(
//           'Event name, event date, and created by are required'
//         ),
//       };
//     }
//     if (
//       typeof eventName !== 'string' ||
//       typeof createdBy !== 'string'
//     ) {
//       return {
//         data: null,
//         error: new Error(
//           'Event name, event date, and created by must be strings'
//         ),
//       };
//     }

//     // Create the new event
//     const event = await addEvent(eventName, eventDate, createdBy);
//     return { data: event, error: null };
//   } catch (err: any) {
//     return { data: null, error: err };
//   }
// }

// /**
//  * -----------------------------
//  * 9. TERMINATE EVENT (PUBLIC API)
//  * -----------------------------
//  * Finds an event by (name, date, createdBy), then calls closeEvent
//  */
// export async function terminateEvent({
//   eventName,
//   eventDate,
//   createdBy,
// }: {
//   eventName: string;
//   eventDate: Date;  // or string
//   createdBy: string;
// }): Promise<{ data: Event[] | null; error: Error | null }> {
//   try {
//     if (!eventName || !eventDate || !createdBy) {
//       return {
//         data: null,
//         error: new Error(
//           'Event name, event date, and created by are required'
//         ),
//       };
//     }
//     if (
//       typeof eventName !== 'string' ||
//       typeof createdBy !== 'string'
//     ) {
//       return {
//         data: null,
//         error: new Error(
//           'Event name, event date, and created by must be strings'
//         ),
//       };
//     }

//     // 1) Find the matching event
//     const event = await getEventById(eventName, eventDate, createdBy);
//     if (event.length === 0) {
//       return { data: null, error: new Error('Event does not exist') };
//     }

//     // 2) Close it
//     const closedEvent = await closeEvent(event[0].event_id!);
//     return { data: closedEvent, error: null };
//   } catch (err: any) {
//     return { data: null, error: err };
//   }
// }

