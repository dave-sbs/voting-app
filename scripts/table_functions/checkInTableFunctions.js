import { supabase } from '../../services/supabaseClient.js';
/*
SCHEMA
check_in_id
member_id: Foreign Key
event_id: Foreign Key
has_checked_in: Boolean
check_in_time: Timestamp
*/



export const createBoardCheckIn = async ({memberId, eventId}) => {
    try {
        const { data, error } = await supabase
            .from('board_check_in')
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
        return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}


export const createGeneralCheckIn = async ({memberId, eventId}) => {
    try {
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
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}


export const updateGeneralCheckIn = async ({memberId, eventId}) => {
    try {
        const { data, error } = await supabase
            .from('check_in')
            .update({
                updated_check_in_time: new Date()
            })
            .eq('member_id', memberId)
            .eq('event_id', eventId)
            .select();

        if (error) throw error;
        return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}   


export const updateBoardCheckIn = async ({memberId, eventId}) => {
    try {
        const { data, error } = await supabase
            .from('board_check_in')
            .update({
                updated_check_in_time: new Date()
            })
            .eq('member_id', memberId)
            .eq('event_id', eventId)
            .select();

        if (error) throw error;
        return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}   