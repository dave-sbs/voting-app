import { supabase } from '../../services/supabaseClient.js';

import { idExists  } from './masterTableFunctions.js';

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
*/


const getAllEvents = async () => {
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