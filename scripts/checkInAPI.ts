import { supabase } from '@/services/supabaseClient';

export interface CheckInCredentials {
    member_id: string;
    event_id: string;
}

export interface Voter {
    member_id: string;
    event_id: string;
    check_in_time: Date;
    updated_check_in_time: Date;
    has_voted: boolean;
}


export async function convertStoreNumbertoId(storeNumber: string): Promise<string | null> {
    const { data: storeData, error: storeError } = await supabase
        .from('organization_members')
        .select('member_id')
        .contains('store_number', [storeNumber])
        .single();

    if (storeError && storeError.code !== 'PGRST116') {
        throw storeError;
    }

    if (storeData && typeof storeData.member_id === 'string') {
        return storeData.member_id;
    }

    return null;
}



export async function checkIn({ member_id, event_id }: CheckInCredentials): Promise<Voter> {
    // Check if member exists
    const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select()
        .eq('member_id', member_id)
        .single();

    // Throw error if member does not exist
    if (memberError) {
        console.error('Error fetching member:', memberError);
        throw memberError;
    }

    // Throw error if member does not exist
    if (!memberData) {
        console.error('Member does not exist in organization members table');
        throw new Error('Member does not exist in organization members table');
    }

    // Check if user has already checked in
    const { data: currentlyCheckedIn, error: currentlyCheckedInError } = await supabase
        .from('check_in')
        .select()
        .eq('member_id', member_id)
        .eq('event_id', event_id)
        .single();

    // Throw error if check in does not exist
    if (currentlyCheckedInError && currentlyCheckedInError.code !== 'PGRST116') {
        console.error('Error fetching check in:', currentlyCheckedInError);
        throw currentlyCheckedInError;
    }

    let checkedInVoter: Voter;

    if (currentlyCheckedIn) {
        // Update existing check-in
        const { data: updatedCheckIn, error: updatedCheckInError } = await supabase
            .from('check_in')
            .update({
                updated_check_in_time: new Date().toISOString(),
            })
            .eq('member_id', member_id)
            .eq('event_id', event_id)
            .select()
            .single();

        if (updatedCheckInError) {
            console.error('Error updating check in:', updatedCheckInError);
            throw updatedCheckInError;
        }

        checkedInVoter = updatedCheckIn as Voter;
    } else {
        // Create a new check-in
        const { data: newCheckIn, error: checkInError } = await supabase
            .from('check_in')
            .insert([
                {
                    member_id,
                    event_id,
                    check_in_time: new Date().toISOString(),
                    updated_check_in_time: new Date().toISOString(),
                    has_voted: false
                },
            ])
            .select()
            .single();

        if (checkInError) {
            console.error('Error creating check in:', checkInError);
            throw checkInError;
        }

        if (!newCheckIn) {
            console.error('No data returned from check in');
            throw new Error('No data returned from check in');
        }

        checkedInVoter = newCheckIn as Voter;
    }

    return {
        member_id: checkedInVoter.member_id,
        event_id: checkedInVoter.event_id,
        check_in_time: checkedInVoter.check_in_time,
        updated_check_in_time: checkedInVoter.updated_check_in_time,
        has_voted: checkedInVoter.has_voted
    };
}