// VotingContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Candidate, 
  getActiveCandidates, 
  addCandidateToDB, 
  removeCandidateFromDB, 
  incrementCandidateVote 
} from '@/scripts/candidateAPI';

/** Event types, if you need them for subscriptions. */
type EventType = 'candidateAdded' | 'candidateRemoved' | 'voteUpdated';

/**
 * Primary shape of your React Context’s value.
 */
interface VotingContextType {
  candidates: Candidate[];
  votes: { [key: string]: number };
  addCandidate: (candidate: Candidate) => Promise<void>;
  removeCandidate: (id: string) => Promise<void>;
  incrementVote: (id: string) => Promise<void>;

  // Optional subscription-based architecture
  subscribe: (eventType: EventType, callback: (data: any) => void) => void;
  unsubscribe: (eventType: EventType, callback: (data: any) => void) => void;
}

/** 
 * Create the VotingContext with an undefined initial value,
 * ensuring consumers must be wrapped by a provider. 
 */
const VotingContext = createContext<VotingContextType | undefined>(undefined);

/** 
 * Custom hook that ensures consumers are within VotingProvider 
 */
export const useVotingContext = (): VotingContextType => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVotingContext must be used within a VotingProvider');
  }
  return context;
};

export const VotingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});

  // Simple subscribers map
  const [subscribers, setSubscribers] = useState<{
    [key in EventType]: ((data: any) => void)[]
  }>({
    candidateAdded: [],
    candidateRemoved: [],
    voteUpdated: [],
  });

  useEffect(() => {
    loadInitialCandidates();
  }, []);

  /**
   * Load the initial list of candidates from Supabase.
   */
  const loadInitialCandidates = async () => {
    try {
      const fetchedCandidates = await getActiveCandidates();
      setCandidates(fetchedCandidates);

      // Build a { [candidateId]: vote_count } object
      const votesObject = fetchedCandidates.reduce((acc, candidate) => {
        acc[candidate.id] = candidate.vote_count || 0;
        return acc;
      }, {} as { [key: string]: number });
      setVotes(votesObject);

    } catch (error) {
      console.error('Error loading initial candidates:', error);
    }
  };

  /**
   * Add a new candidate both locally and in the DB.
   */
  const addCandidate = async (candidate: Candidate) => {
    try {
      // if the candidate already exists, return
      const existingCandidate = candidates.find(c => c.id === candidate.id);
      if (existingCandidate) {
        console.log(`Candidate with ID ${candidate.id} already exists in the database.`);
        return;
      }

      await addCandidateToDB(candidate);
      // Update local state
      setCandidates(prev => [...prev, candidate]);
      setVotes(prev => ({ ...prev, [candidate.id]: candidate.vote_count || 0 }));

      notify('candidateAdded', candidate);
      console.log('Candidate added:', candidate);
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  /**
   * Remove candidate locally and from DB.
   */
  const removeCandidate = async (id: string) => {
    try {
      await removeCandidateFromDB(id);
      setCandidates(prev => prev.filter(c => c.id !== id));

      const { [id]: _, ...remainingVotes } = votes; // remove candidate from votes
      setVotes(remainingVotes);

      notify('candidateRemoved', id);
    } catch (error) {
      console.error('Error removing candidate:', error);
    }
  };

  /**
   * Increment the vote for a particular candidate in DB and local state.
   */
  const incrementVote = async (id: string) => {
    try {
      await incrementCandidateVote(id);
      setVotes(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
      notify('voteUpdated', { id, newCount: votes[id] + 1 });
    } catch (error) {
      console.error('Error incrementing vote:', error);
    }
  };

  /**
   * Notify all subscribers of an event.
   */
  const notify = (eventType: EventType, data: any) => {
    subscribers[eventType].forEach(callback => callback(data));
  };

  /**
   * Subscribe to a particular event type.
   */
  const subscribe = (eventType: EventType, callback: (data: any) => void) => {
    setSubscribers(prev => ({
      ...prev,
      [eventType]: [...prev[eventType], callback],
    }));
  };

  /**
   * Unsubscribe from a particular event type.
   */
  const unsubscribe = (eventType: EventType, callback: (data: any) => void) => {
    setSubscribers(prev => ({
      ...prev,
      [eventType]: prev[eventType].filter(cb => cb !== callback),
    }));
  };

  const contextValue: VotingContextType = {
    candidates,
    votes,
    addCandidate,
    removeCandidate,
    incrementVote,
    subscribe,
    unsubscribe,
  };

  return (
    <VotingContext.Provider value={contextValue}>
      {children}
    </VotingContext.Provider>
  );
};
