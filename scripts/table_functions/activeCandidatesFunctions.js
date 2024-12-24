import { supabase } from '../../services/supabaseClient.js';


const addNewCandidate = async ({ memberId, profile_picture }) => {
    const { data, error } = await supabase
        .from('active_candidates')
        .insert([
            {
                member_id: memberId, 
                vote_count: 0,
                profile_picture: profile_picture
            }
        ])
        .select();

    if (error) throw error;
    return data;    
}


const updateVote = async ({ memberId }) => {
    const { data, error } = await supabase
        .from('active_candidates')
        .update({
            votes: data.vote_count + 1
        })
        .eq('member_id', memberId)
        .select();

    if (error) throw error;
    return data;
}



export const getActiveCandidates = async () => {
    try {
        const { data, error } = await supabase
            .from('active_candidates')
            .select();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}


export const insertActiveCandidate = async ({ memberId, profile_picture }) => {
    try {
        const { currData, currError } = await getActiveCandidates();

        if (currError) {
            throw currError;
        }

        const member = currData?.find((member) => member.member_id === memberId);
        if (!member) {
            const { data, error } = await addNewCandidate({ memberId, profile_picture });
            if (error) throw error;
            return { data, error: null };
        }

        return { data: member, error: null };
    } catch (error) {
        return { data: null, error };
    }
}


export const deleteActiveCandidate = async ({ memberId }) => {
    console.log(`Attempting to delete active candidate with memberId: ${memberId}`);
    try {
        const { data, error } = await supabase
            .from('active_candidates')
            .delete()
            .eq('member_id', memberId);

        if (error) {
            console.error(`Error deleting active candidate: ${error.message}`);
            throw error;
        }
        console.log(`Successfully deleted active candidate with memberId: ${memberId}`);
        return { data, error: null };
    } catch (error) {
        console.error(`Caught error in deleteActiveCandidate: ${error.message}`);
        return { data: null, error };
    }
}


export const deleteAllActiveCandidates = async () => {
    try {
        const { data, error } = await supabase
            .from('active_candidates')
            .delete();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}   


export const addVote = async ({ voterId, candidateId }) => {
    try{
        const { data: voterData, error: voterError } = await supabase
            .from('vote_status')
            .select()
            .eq('member_id', voterId);

        if (voterError) {
            throw voterError;
        }

        // Check if the voter has already voted
        if (voterData.has_voted){
            return { data: null, error: new Error('You have already voted') };
        } else {
            const { data, error } = await updateVote({ memberId: candidateId });
            if (error) throw error;
            return { data, error: null };
        }
    } 
    catch (error) {
        return { data: null, error };
    }
}