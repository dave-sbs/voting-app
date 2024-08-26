import React, { createContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface Candidate {
  id: number;
  name: string;
  image: string;
}

interface Voters {
  id: number;
  hasVoted: boolean;
}


interface CandidatesContextType {
  candidates: Candidate[];
  voters: Voters[];
  minChoice: number;
  votes: { [key: string]: number };
  currVoter: number;
  uniqueVotes: number;
  addCandidate: (name: string, image: string) => void;
  addVoter: (id: number) => void;
  setCurrVoter: (choice: number) => void;
  updateVoter: (id: number, hasVoted: boolean) => void;
  removeCandidate: (indexOrName: string) => void;
  setMinChoice: (choice: number) => void;
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
  const [uniqueVotes, setUniqueVotesState] = useState<number>(0);
  const [currVoter, setCurrVoterState] = useState<number>(0);

  const loadCandidates = async () => {
    const storedVoters = await AsyncStorage.getItem('voters');
    const uniqueVoters = await AsyncStorage.getItem('uniqueVotes');
    const storedCandidates = await AsyncStorage.getItem('candidates');
    const storedVotes = await AsyncStorage.getItem('votes');
    const storedMinChoice = await AsyncStorage.getItem('minChoice');
    if (storedCandidates) setCandidates(JSON.parse(storedCandidates));
    if (uniqueVoters) setUniqueVotesState(parseInt(uniqueVoters));
    if (storedVotes) setVotes(JSON.parse(storedVotes));
    if (storedMinChoice) setMinChoiceState(parseInt(storedMinChoice));
    if (storedVoters) setVoters(JSON.parse(storedVoters));
  };

  React.useEffect(() => {
    loadCandidates();
  }, []);

  const addCandidate = async (name: string, image: string) => {
    const newCandidate = { id: Date.now(), name, image };
    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    setVotes({ ...votes, [name]: 0 });
    await AsyncStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    await AsyncStorage.setItem('votes', JSON.stringify({ ...votes, [name]: 0 }));
  };

  const addVoter = async (id: number) => {
    const newVoter = { id, hasVoted: false };
    const updatedVoters = [...voters, newVoter];
    setVoters(updatedVoters);
    await AsyncStorage.setItem('voters', JSON.stringify(updatedVoters));
  };

  const updateVoter = async (id: number, hasVoted: boolean) => {
    const updatedVoters = voters.map(voter => {
      if (voter.id === id) {
        return { ...voter, hasVoted };
      }
      return voter;
    });
    setVoters(updatedVoters);
    await AsyncStorage.setItem('voters', JSON.stringify(updatedVoters));
  };

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
    };
  };

  const setCurrVoter = async (choice: number) => {
    setCurrVoterState(choice);
    await AsyncStorage.setItem('currVoter', choice.toString());
  }

  const setMinChoice = async (choice: number) => {
    setMinChoiceState(choice);
    await AsyncStorage.setItem('minChoice', choice.toString());
  };

  const tallyVote = async ({ updatedVotes }: { updatedVotes: {  [x: string]: number } }) => {
    setVotes(updatedVotes);
    await AsyncStorage.setItem('votes', JSON.stringify(updatedVotes));
  };

  const setUniqueVotes = async (choice: number) => {
    let votesCasted = 0;

    voters.map(voter => {
      if (voter.hasVoted) {
        votesCasted++;
      }
    });

    setUniqueVotesState(votesCasted);
    await AsyncStorage.setItem('uniqueVotes', votesCasted.toString());
  };

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
      setCurrVoter(0);
      setUniqueVotes(0);
      await AsyncStorage.setItem('voters', JSON.stringify([]));
    };
  };

  return (
    <CandidatesContext.Provider value={{ voters, candidates, minChoice, votes, currVoter, uniqueVotes, addCandidate, addVoter, updateVoter, setCurrVoter, removeCandidate, setMinChoice, tallyVote, setUniqueVotes, resetVotersArr }}>
      {children}
    </CandidatesContext.Provider>
  );
};