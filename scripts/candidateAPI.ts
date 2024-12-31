// // candidateAPI.ts

// import { supabase } from '@/services/supabaseClient';

// /** 
//  * A basic interface describing a candidate 
//  * in your application.
//  */
// export interface Candidate {
//   id: string;
//   name: string;      // The member's name
//   image?: string | null;    // Image (profile_picture)
//   vote_count?: number;
// }

// /**
//  * Fetch all active candidates from the database.
//  */
// export async function getActiveCandidates(): Promise<Candidate[]> {
//   const { data, error } = await supabase
//     .from('active_candidates')
//     .select();

//   if (error) {
//     console.error('Error fetching active candidates:', error);
//     throw error;
//   }

//   // Convert the raw DB entries into a Candidate array
//   return (data || []).map((row: any) => ({
//     id: row.member_id,
//     name: row.member_name || 'Unknown Member',  // If you have a way to fetch name, add it here
//     image: row.profile_picture || '',
//     vote_count: row.vote_count || 0,
//   })) as Candidate[];
// }

// /**
//  * Insert a new candidate into the database if they don’t exist.
//  */
// export async function addCandidateToDB(candidate: Candidate): Promise<void> {
//   // Get the unique member_id of the new candidate
//   const { data: existingData, error: fetchError } = await supabase
//     .from('organization_members')
//     .select()
//     .eq('member_name', candidate.name)
//     .single();

//   if (fetchError || !existingData) {
//     console.error(`Error fetching existing candidate (name: ${candidate.name})`, fetchError);
//     throw fetchError;
//   }

//   const newEntryId = existingData.member_id;

//   // Check if the candidate already exists in the candidates table
//   const existingCandidate = await supabase
//     .from('active_candidates')
//     .select()
//     .eq('member_id', newEntryId)
//     .single();

//   console.log(existingCandidate)

//   if (existingCandidate.data) {
//     console.log(`Candidate with ID ${newEntryId} already exists in the database.`);
//     return;
//   } else {
//     // Insert the candidate into the candidates table
//     const { data, error } = await supabase
//       .from('active_candidates')
//       .insert([
//         {
//           member_id: newEntryId,
//           member_name:candidate.name,
//           profile_picture: candidate.image || '',
//           vote_count: candidate.vote_count || 0,
//         },
//       ]);

//     if (error) {
//       console.error('Error adding candidate:', error);
//       throw error;
//     }
//   }
// };

// /**
//  * Delete a candidate from the database by id.
//  */
// export async function removeCandidateFromDB(id: string): Promise<void> {
//   const { error } = await supabase
//     .from('active_candidates')
//     .delete()
//     .eq('member_id', id);

//   if (error) {
//     console.error(`Error removing candidate (id: ${id})`, error);
//     throw error;
//   }
// }

// /**
//  * Increment the vote count for a specific candidate.
//  */
// export async function incrementCandidateVote(id: string): Promise<void> {
//   // First, retrieve the candidate’s current vote_count
//   const { data: existingData, error: fetchError } = await supabase
//     .from('active_candidates')
//     .select('vote_count')
//     .eq('member_id', id)
//     .single();

//   if (fetchError || !existingData) {
//     console.error(`Error fetching candidate’s vote_count for id: ${id}`, fetchError);
//     throw fetchError;
//   }

//   const currentVotes = existingData.vote_count || 0;

//   // Now increment the vote_count
//   const { error: updateError } = await supabase
//     .from('active_candidates')
//     .update({ vote_count: currentVotes + 1 })
//     .eq('member_id', id);

//   if (updateError) {
//     console.error('Error updating vote count:', updateError);
//     throw updateError;
//   }
// }


// Import database access

import { supabase } from '@/services/supabaseClient';


// Define the interface for a candidate
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
  console.log('THIS IS BEING CALLED')
    // Retrieve the unique member_id of the candidate from the organization table
    const {data: existingCandidate, error: existingCandidateError } = await supabase
    .from('organization_members')
    .select()
    .eq('member_name', candidate.name)
    .single();

    if (existingCandidateError || !existingCandidate){
        console.error(`Error fetching existing candidate (name: ${candidate.name})`)
        throw existingCandidateError;
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
        console.error('Candidate already exists in the database.')
        return;
    } else {
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
            console.error('Error adding candidate:', insertError);
            throw insertError;
        }
    };
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