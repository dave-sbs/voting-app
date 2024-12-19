import { supabase } from '../../services/supabaseClient.js';
/*
SCHEMA
check_in_id
member_id: Foreign Key
event_id: Foreign Key
has_checked_in: Boolean
check_in_time: Timestamp


*/

export const createBoardCheckIn = async (memberId, eventId) => {
    const { data, error } = await supabase
    .from('board_check_in')
    .insert([
        {
            member_id: memberId,
            event_id: eventId
        }
    ])
    .select();

    if (error) throw error;
    return data;
}


export const createNewCheckIn = async (memberId, eventId) => {
    const { data, error } = await supabase
    .from('check_in')
    .insert([
        {
            member_id: memberId,
            event_id: eventId,
            has_checked_in: true,
            check_in_time: new Date()
        }
    ])
    .select();

    if (error) throw error;
    return data;
}