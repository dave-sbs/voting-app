import React, { createContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface Candidate {
  id: number;
  name: string;
  image: string;
}

interface Voters {
  name: string;
  id: string;
  hasVoted: boolean;
}


interface CandidatesContextType {
  candidates: Candidate[];
  voters: Voters[];
  minChoice: number;
  maxChoice: number;
  votes: { [key: string]: number };
  currVoter: string;
  uniqueVotes: number;
  addCandidate: (name: string, image: string) => void;
  addVoter: (name: string, id: string) => void;
  setCurrVoter: (choice: string) => void;
  updateVoter: (id: string, hasVoted: boolean) => void;
  removeCandidate: (indexOrName: string) => void;
  setMinChoice: (choice: number) => void;
  setMaxChoice: (choice: number) => void;
  tallyVote: ({ updatedVotes }: { updatedVotes: {  [x: string]: number } }) => Promise<void>;
  setUniqueVotes: (choice: number) => void;
  resetVotersArr: () => void;
}

export const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export const CandidatesProvider = ({ children }: { children: ReactNode }) => {
  const [voters, setVoters] = useState<Voters[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [minChoice, setMinChoiceState] = useState<number>(2);
  const [maxChoice, setmaxChoiceState] = useState<number>(6);
  const [uniqueVotes, setUniqueVotesState] = useState<number>(0);
  const [currVoter, setCurrVoterState] = useState<string>('');


  const loadVoters = async () => {
    const votersData = require('../../scripts/voters.json');
    const votersArr = votersData.map((voter: { id: string; name: string }) => ({
      id: voter.id,
      name: voter.name,
      hasVoted: false,
    }));
    setVoters(votersArr);
    await AsyncStorage.setItem('voters', JSON.stringify(votersArr));
  }

  const loadCandidates = async () => {
    const storedVoters = await AsyncStorage.getItem('voters');
    const uniqueVoters = await AsyncStorage.getItem('uniqueVotes');
    const storedCandidates = await AsyncStorage.getItem('candidates');
    const storedVotes = await AsyncStorage.getItem('votes');
    const storedMaxChoice = await AsyncStorage.getItem('maxChoice');
    const storedMinChoice = await AsyncStorage.getItem('minChoice');
    if (storedCandidates) setCandidates(JSON.parse(storedCandidates));
    if (uniqueVoters) setUniqueVotesState(parseInt(uniqueVoters));
    if (storedVotes) setVotes(JSON.parse(storedVotes));
    if (storedMaxChoice) setmaxChoiceState(parseInt(storedMaxChoice));
    if (storedMinChoice) setMinChoiceState(parseInt(storedMinChoice));
    if (storedVoters) setVoters(JSON.parse(storedVoters));
  };

  React.useEffect(() => {
    loadCandidates();
    loadVoters();
  }, []);

  /**
   * Adds a new candidate to the candidates array and persists it to storage.
   * Also adds the candidate to the votes object with a value of 0, and persists that to storage.
   * @param {string} name The name of the candidate to add.
   * @param {string} image The image uri of the candidate to add.
   */
  const addCandidate = async (name: string, image: string) => {
    const newCandidate = { id: Date.now(), name, image };
    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    setVotes({ ...votes, [name]: 0 });
    await AsyncStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    await AsyncStorage.setItem('votes', JSON.stringify({ ...votes, [name]: 0 }));
  };

  /**
   * Adds a new voter to state and storage.
   * @param name the name of the voter to add
   * @param id the id of the voter to add
   */
  const addVoter = async (name: string, id: string) => {
    const newVoter = { name, id, hasVoted: false };
    const updatedVoters = [...voters, newVoter];
    setVoters(updatedVoters);
    await AsyncStorage.setItem('voters', JSON.stringify(updatedVoters));
  };

  /**
   * Updates the hasVoted property of a voter in state and storage.
   * @param id the id of the voter to update
   * @param hasVoted whether the voter has voted or not
   */
  const updateVoter = async (id: string, hasVoted: boolean) => {
    const updatedVoters = voters.map(voter => {
      if (voter.id === id) {
        return { ...voter, hasVoted };
      }
      return voter;
    });
    setVoters(updatedVoters);
    await AsyncStorage.setItem('voters', JSON.stringify(updatedVoters));
  };

  /**
   * Removes a candidate from state and storage, and asks for confirmation first.
   * @param indexOrName the index or name of the candidate to remove
   */
  const removeCandidate = async (indexOrName: string) => {
    const confirmed = await new Promise<boolean>((resolve) =>
      Alert.alert(
        `Are you sure you want to remove ${indexOrName}`,
        'This action is permanent',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Confirm',
            onPress: () => resolve(true),
          },
        ],
      ),
    );

    if (confirmed) {
      let updatedCandidates;
      let updatedVotes = { ...votes };
      delete updatedVotes[indexOrName];
      setVotes(updatedVotes);
      if (isNaN(Number(indexOrName))) {
        updatedCandidates = candidates.filter(candidate => candidate.name !== indexOrName);
      } else {
        updatedCandidates = candidates.filter((_, index) => index !== Number(indexOrName));
      }
      setCandidates(updatedCandidates);
      await AsyncStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      await AsyncStorage.setItem('votes', JSON.stringify(updatedVotes));

      if (updatedCandidates.length === 0) {
        setUniqueVotesState(0);
        await AsyncStorage.setItem('uniqueVotes', '0');
      }
    };
  };

  const setCurrVoter = async (choice: string) => {
    setCurrVoterState(choice);
    await AsyncStorage.setItem('currVoter', choice.toString());
  }

  const setMaxChoice = async (choice: number) => {
    setmaxChoiceState(choice);
    await AsyncStorage.setItem('maxChoice', choice.toString());
  };

  const setMinChoice = async (choice: number) => {
    setMinChoiceState(choice);
    await AsyncStorage.setItem('minChoice', choice.toString());
  };

  const tallyVote = async ({ updatedVotes }: { updatedVotes: {  [x: string]: number } }) => {
    setVotes(updatedVotes);
    await AsyncStorage.setItem('votes', JSON.stringify(updatedVotes));
  };

  const setUniqueVotes = async (choice: number) => {
    setUniqueVotesState(choice);
    await AsyncStorage.setItem('uniqueVotes', choice.toString());
  };

  /**
   * Resets the voter data to its initial state. This function asks for
   * confirmation before doing so. If the user confirms, the following
   * state and AsyncStorage values are reset to their initial values:
   * - {@link voters}
   * - {@link currVoter}
   * - {@link uniqueVotes}
   * - `voters` key in AsyncStorage
   * - `currVoter` key in AsyncStorage
   * - `uniqueVotes` key in AsyncStorage
   */
  const resetVotersArr = async () => {
    const confirmed = await new Promise<boolean>((resolve) =>
      Alert.alert(
        `Are you sure you want to clear the voter data?`,
        'This action is permanent',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Confirm',
            onPress: () => resolve(true),
          },
        ],
      ),
    );

    if (confirmed) {
      setVoters([]);
      setCurrVoterState('');
      setUniqueVotesState(0);

      loadVoters();
      
      await AsyncStorage.setItem('currVoter', '0');
      await AsyncStorage.setItem('uniqueVotes', '0');
    };
  };

  return (
    <CandidatesContext.Provider value={{ voters, candidates, maxChoice, minChoice, votes, currVoter, uniqueVotes, addCandidate, addVoter, updateVoter, setCurrVoter, removeCandidate, setMinChoice, setMaxChoice, tallyVote, setUniqueVotes, resetVotersArr }}>
      {children}
    </CandidatesContext.Provider>
  );
};