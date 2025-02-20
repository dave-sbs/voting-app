/*
Voting API file that performs CRUD operations related to the voting process

TABLES
- active_candidates: To count the votes of each candidate
- vote_status: To ensure the same person doesn't vote multiple times

- check_in: Main purpose is to really just track attendance of people during meetings. Let's also track has_voted on the same table.


LOGIC
So the real question is should I go through the Check In logic before this API?
That way I have a proper flow for the user journey: 
    - Create an event (General or Board meeting)
        - Entry at events
    - Admin inserts Candidates [DONE]
        - Entry at active_candidates
        - Entry/Adjustment at voting_settings
    - User Logs In
        - Entry at check_in
    - User submits their vote
        - Entry at vote_status
        - Entry at active_candidates


VOTING PROCESS
- User has to be checked in to be at the Voting Page so no need to make that check.
- The only check to do is on the context file, ensure the person fulfils the vote_settings range
- Check that person has a FALSE value on has_voted
*/



import { supabase } from '@/services/supabaseClient';


// Define the interface for a candidate
export interface Candidate {
    id: string;
    name: string;
    profile_picture: string; 
    vote_count: number; 
};


export interface Voter {
    member_id: string;
    event_id: string;
    check_in_time: Date;
    updated_check_in_time: Date;
    has_voted: boolean;
}

export async function submitVote(voter: Voter, candidateChoices: Candidate[]) {
    // given the voter object, and a list of candidates check whether the voter is eligible and increment the vote_count of each candidate
    const { data: eligibleVoter, error: eligibleVoterError } = await supabase
    .from('check_in')
    .select('*')
    .eq('member_id', voter.member_id)
    .single();

    if (eligibleVoterError) {
        console.error(`Error fetching existing voter (name: ${voter.member_id})`);
        throw eligibleVoter;
    }

    // Check the has_voted status
    if (eligibleVoter.has_voted) {
        console.error('Voter has already voted.')
        throw new Error('Voter has already voted.');
    }

    console.log(candidateChoices);

    // For each candidate in the list, update their vote_count
    await Promise.all(
        candidateChoices.map(async (candidate) => {
            console.log(`Updating vote count for candidate ${candidate.name}`);
            const { error: updateCandidateError } = await supabase
            .from('active_candidates')
            .update({ vote_count: (candidate.vote_count + 1) })
            .eq('member_id', candidate.id)
            .select();

            if (updateCandidateError) {
                console.error(`Error updating vote count for candidate ${candidate.name}:`, updateCandidateError);
                throw new Error(`Error updating vote count for candidate ${candidate.name}: ${updateCandidateError}`);
            }
        })
    );

    // Update the voter's status
    const { error: voterUpdateError } = await supabase
    .from('check_in')
    .update({ has_voted: true })
    .eq('member_id', voter.member_id);

    if (voterUpdateError) {
        console.error(`Error updating voter status for ${voter.member_id}:`, voterUpdateError);
        throw voterUpdateError;
    }
}
