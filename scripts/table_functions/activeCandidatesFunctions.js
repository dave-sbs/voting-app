import { supabase } from '../../services/supabaseClient.js';


const addNewCandidate = async ({ memberId, profile_pic }) => {
    const { data, error } = await supabase
        .from('active_candidates')
        .insert([
            {
                member_id: memberId, 
                vote_count: 0,
                profile_pic: profile_pic
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



const getActiveCandidates = async () => {
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


export const insertActiveCandidate = async ({ memberId, profile_pic }) => {
    try {
        const { currData, currError } = await getActiveCandidates();

        if (currError) {
            throw currError;
        }

        const member = currData.find((member) => member.member_id === memberId);
        if (!member) {
            const { data, error } = await addNewCandidate({ memberId, profile_pic });
            if (error) throw error;
            return { data, error: null };
        }

        return { data: member, error: null };
    } catch (error) {
        return { data: null, error };
    }
}


export const deleteActiveCandidate = async ({ memberId }) => {
    try {
        const { data, error } = await supabase
            .from('active_candidates')
            .delete()
            .eq('member_id', memberId);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
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