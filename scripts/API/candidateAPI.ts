import { supabase } from '@/services/supabaseClient';


/**
 * -----------------------------
 * CANDIDATE SCHEMA
 * -----------------------------
 * member_id (primary key)   
 * candidate_name: string       
 * candidate_picture: string   
 * vote_count: number          
 */

export interface Candidate {
    id: string;
    name: string;
    profile_picture: string; 
    vote_count: number; 
};


// Get all currently active candidates
export async function getActiveCandidates(): Promise<Candidate[]> {
    const { data: activeCandidateData, error: activeCandidateError } = await supabase
    .from('active_candidates')
    .select();

    if (activeCandidateError) {
        throw Error('Error fetching active candidates:', activeCandidateError);
    }

    return (activeCandidateData || []).map((row: any) => ({
        id: row.member_id,
        name: row.member_name,
        profile_picture: row.profile_picture,
        vote_count: row.vote_count,
    })) as Candidate[];
};


export async function insertNewCandidate(candidate: Candidate) {
    // Retrieve the unique member_id of the candidate from the organization table
    const {data: existingCandidate, error: existingCandidateError } = await supabase
    .from('organization_members')
    .select()
    .eq('member_name', candidate.name)
    .single();

    if (existingCandidateError || !existingCandidate){
        throw new Error(`Member "${candidate.name}" not found in organization. Please check the name and try again.`);
    }

    // Get the member_id
    const candidateMemberId = existingCandidate.member_id;

    // Check whether it is currently in the database
    const candidateExists = await supabase
    .from('active_candidates')
    .select()
    .eq('member_id', candidateMemberId)
    .single();

    if (candidateExists.data){
        throw new Error(`${candidate.name} is already registered as a candidate.`);
    }

    const { data: insertData, error: insertError } = await supabase
    .from('active_candidates')
    .insert([
        {
            member_id: candidateMemberId,
            member_name: candidate.name,
            profile_picture: candidate.profile_picture,
            vote_count: candidate.vote_count,
        },
    ]);

    if (insertError) {
        throw new Error(`Failed to add candidate: ${insertError.message}`);
    }
}


export async function clearActiveCandidates() {
    const { data: resetData, error: resetError } = await supabase
    .from('active_candidates')
    .delete()
    
    if(resetError) {
        console.error('Error resetting table', resetError);
        throw resetError;
    }
};


export async function removeCandidate(candidate: Candidate): Promise<void> {
    const { data: removeData, error: removeError } = await supabase
    .from('active_candidates')
    .delete()
    .eq('member_id', candidate.id)
    .single();

    if(removeError){
        console.error('Error deleting candidate', removeError);
        throw removeError;
    }
}