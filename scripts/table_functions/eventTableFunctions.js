import { supabase } from '../../services/supabaseClient.js';
/*
SCHEMA
event_name: String
event_date: Timestamp
created_by: String
status: Boolean
*/




/*
The function I need is actually:
1. Get all events
2. Find the last general meeting event
3. Find the last board meeting event

It currently allows events with the same data to be duplicated. Need to fix
If a board meeting session is already open, don't allow another one to be created. 
Same for a general meeting.
*/


const addEvent = async (eventName, eventDate, createdBy) => {
    const open = eventName === 'AUTO' ? false : true;
    const { data, error } = await supabase
    .from('events')
    .insert([
        {
            event_name: eventName,
            event_date: eventDate,
            created_by: createdBy,
            status: open
        }
    ])
    .select();

    if (error) throw error;
    return data;
}


const closeEvent = async (eventId) => {
    const { data, error } = await supabase
    .from('events')
    .update({
        status: false
    })
    .eq('event_id', eventId)
    .select();

    if (error) throw error;
    return data;
}

const getEventById = async (eventName, eventDate, createdBy) => {
    if (!eventName || !eventDate || !createdBy) {
        return { data: null, error: new Error('Event name, event date, and created by are required') };
    }
    const { data, error } = await supabase
    .from('events')
    .select()
    .eq('event_name', eventName)
    .eq('event_date', eventDate)
    .eq('created_by', createdBy);

    if (error) throw error;
    return { data, error: null };           
}


export const getAllEvents = async () => {
    try {
        const { data, error } = await supabase
        .from('events')
        .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };   
    }
};


export const getOpenEvents = async () => {
    try {
        const { data, error } = await supabase
        .from('events')
        .select()
        .eq('status', true);    

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };   
    }
};  


/*
Will eventually change it so that we can either name every new event to General Meeting or Board Meeting, or have it automatically be AUTO
Event Date will be the current date, and Created By will be either Auto or the current admin
For now let's require all parameters.
*/
export const insertEvent = async ({ eventName, eventDate, createdBy }) => {
    try {
        // Check for empty parameters
        if (!eventName || !eventDate || !createdBy) {
            return { data: null, error: new Error('Event name, event date, and created by are required') };
        }

        // Check for wrong data entry
        else if (typeof eventName !== 'string' || typeof createdBy !== 'string') {
            return { data: null, error: new Error('Event name, event date, and created by must be strings') };
        }

        // Create new event
        const event = await addEvent(eventName, eventDate, createdBy);
        return { data: event, error: null };
    }
    catch (error) {
        return { data: null, error };
    }
};


export const terminateEvent = async ({ eventName, eventDate, createdBy }) => {
    try {
        // Check for empty parameters
        if (!eventName || !eventDate || !createdBy) {
            return { data: null, error: new Error('Event name, event date, and created by are required') };
        }

        // Check for wrong data entry
        else if (typeof eventName !== 'string' || typeof createdBy !== 'string') {
            return { data: null, error: new Error('Event name, event date, and created by must be strings') };
        }

        // Get event id
        const event = await getEventById(eventName, eventDate, createdBy);

        if (event.data.length === 0) {
            return { data: null, error: new Error('Event does not exist') };
        }

        // Close event
        const closedEvent = await closeEvent(event.data[0].event_id);
        return { data: closedEvent, error: null };
    } catch (error) {
        return { data: null, error };
    }
}



export const getLastGeneralMeetingEvent = async () => {
    try {
        const { data, error } = await supabase
        .from('events')
        .select()
        .eq('event_name', 'General Meeting')
        .order('event_date', { ascending: false })
        .limit(1);

        if (error) throw error;
        return { data, error: null };
    } 
    catch (error) {
        return { data: null, error };
    }
};


export const getLastBoardMeetingEvent = async () => {
    try {
        const { data, error } = await supabase
        .from('events')
        .select()
        .eq('event_name', 'Board Meeting')
        .order('event_date', { ascending: false })
        .limit(1);

        if (error) throw error;
        return { data, error: null };
    } 
    catch (error) {
        return { data: null, error };
    }
};