import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

import { 
  Candidate,
  submitVote,
} from '@/scripts/votingAPI';

import {
  Voter, 
  checkIn,
  getAllVoters,
  CheckInCredentials,
  getNamefromId,
  getAllCheckIns
} from '@/scripts/checkInAPI';

import { getActiveCandidates } from '@/scripts/candidateAPI';

interface VotingContextProps {
  // State
  voter: Voter | null;
  uniqueVotes: Voter[];
  checkedInVoters: Voter[];
  candidates: Candidate[];   
  chosenCandidatesList: Candidate[];
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;

  //Actions
  fetchCandidates: () => Promise<void>;
  fetchVoters: () => Promise<Voter[] | null>;
  fetchCheckedIn: () => Promise<Voter[] | null>;
  checkInVoter: (creds: CheckInCredentials) => Promise<void>;
  selectCandidate: (candidate: Candidate) => void;
  deselectCandidate: (candidate: Candidate) => void;
  castVotes: () => Promise<void>;
};


const VotingContext = createContext<VotingContextProps>({
  voter: null,
  candidates: [],
  uniqueVotes: [],
  chosenCandidatesList: [],
  checkedInVoters: [],
  isLoading: false,
  error: null,
  fetchCandidates: async () => undefined,
  fetchVoters: async () => null,
  fetchCheckedIn: async () => null,
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
  const [uniqueVotes, setUniqueVotes] = useState<Voter[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [checkedInVoters, setCheckedInVoters] = useState<Voter[]>([]);

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
  *  Access the Check In table and retrieve all rows with has_voted property True
  */
  const fetchVoters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAllVoters();
      console.log(result);
      setUniqueVotes(result);
      return result;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch voters');
      return null;
    } finally {
      setIsLoading(false);
    }
  },[]);

  const fetchCheckedIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const checkIns = await getAllCheckIns();
      console.log(checkIns);
      setCheckedInVoters(checkIns);
      return checkIns;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch checked-in voters');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkInVoter = useCallback(async (creds: CheckInCredentials) : Promise<void> => {
    setIsLoading(true);
    setError(null);
    try{
      const voterResponse = await checkIn(creds);
      setVoter(voterResponse);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch candidates');
      throw new Error(err.message || 'Failed to fetch candidates');
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
        return prev;
      }
      return [...prev, candidate];
    });
  }, []);

  const deselectCandidate = useCallback((candidate: Candidate) => {
    setCandidateChoices((prev) => prev.filter((c) => c.id !== candidate.id));
  }, []);

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
    uniqueVotes,
    chosenCandidatesList: candidateChoices,
    checkedInVoters,
    isLoading,
    error,
    fetchCandidates,
    fetchVoters,
    fetchCheckedIn,
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

export function useVotingContext() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVotingContext must be used within a VotingProvider');
  }
  return context;
};