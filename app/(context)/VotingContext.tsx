import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

import { 
  Candidate,
  submitVote,
} from '@/scripts/votingAPI';

import {
  Voter, 
  checkIn,
  convertStoreNumbertoId,
  CheckInCredentials
} from '@/scripts/checkInAPI';

import { getActiveCandidates } from '@/scripts/candidateAPI';

interface VotingContextProps {
  // State
  voter: Voter | null;                    // current checked in voter 
  candidates: Candidate[];                // current list of candidates
  chosenCandidatesList: Candidate[];      // list of candidates the voter has chosen to vote for
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;

  //Actions
  fetchCandidates: () => Promise<void>;
  checkInVoter: (creds: CheckInCredentials) => Promise<void>;
  selectCandidate: (candidate: Candidate) => void;
  deselectCandidate: (candidate: Candidate) => void;
  castVotes: () => Promise<void>; // No need to pass voter if we store it in state
};


const VotingContext = createContext<VotingContextProps>({
  voter: null,
  candidates: [],
  chosenCandidatesList: [],
  isLoading: false,
  error: null,
  fetchCandidates: async () => undefined,
  checkInVoter: async () => undefined,
  selectCandidate: () => {},
  deselectCandidate: () => {},
  castVotes: async () => undefined
});


interface VotingProviderProps{
  children: ReactNode;
}


export const VotingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State stored Voter and Candidates
  const [voter, setVoter] = useState<Voter | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Client-side chosen Candidates
  const [candidateChoices, setCandidateChoices] = useState<Candidate[]>([]);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load the initial list of candidates from Supabase.
   */
  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getActiveCandidates();
      setCandidates(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch candidates');
    } finally {
      setIsLoading(false);
    }
  }, []);


  /*
  Check In the user and set them as the current voter
  */

  const checkInVoter = useCallback(async (creds: CheckInCredentials) => {
    setIsLoading(true);
    setError(null);

    try{
      const voterResponse = await checkIn(creds);
      setVoter(voterResponse);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch candidates');
    } finally {
      setIsLoading(false);
    }
  }, []);

    /* 
    Selecting and Deselcting candidates in the local state
    */
  const selectCandidate = useCallback((candidate: Candidate) => {
    setCandidateChoices((prev) => {
      if (prev.find((c) => c.id === candidate.id)) {
        return prev; //already selected
      }
      return [...prev, candidate];
    });
  }, []);

  const deselectCandidate = useCallback((candidate: Candidate) => {
    setCandidateChoices((prev) => prev.filter((c) => c.id !== candidate.id));
  }, []);

  // In VotingContext.tsx:

  const castVotes = useCallback(async () => {
    if (!voter) {
      // Provide a specific error for no voter
      const msg = 'No voter is currently logged in.';
      setError(msg);
      throw new Error(msg);
    }

    setIsLoading(true);
    setError(null);

    try {
      await submitVote(voter, candidateChoices);
      setCandidateChoices([]);
    } catch (err: any) {
      console.error('castVotes error:', err);

      const message = err?.message || 'Failed to cast the vote.';
      setError(message);

      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [voter, candidateChoices]);



  useEffect(() => {
    fetchCandidates();
  }, []);


  const contextValue: VotingContextProps = {
    voter,
    candidates,
    chosenCandidatesList: candidateChoices,
    isLoading,
    error,
    fetchCandidates,
    checkInVoter,
    selectCandidate,
    deselectCandidate,
    castVotes
  };

  return (
    <VotingContext.Provider value={contextValue}>
      {children}
    </VotingContext.Provider>
  );
};


/** 
 * Custom hook that ensures consumers are within VotingProvider 
 */
export function useVotingContext() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVotingContext must be used within a VotingProvider');
  }
  return context;
};