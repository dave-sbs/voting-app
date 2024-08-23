import React, { createContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface Candidate {
  id: number;
  name: string;
  image: string;
}

interface CandidatesContextType {
  candidates: Candidate[];
  minChoice: number;
  votes: { [key: string]: number };
  uniqueVotes: number;
  addCandidate: (name: string, image: string) => void;
  removeCandidate: (indexOrName: string) => void;
  setMinChoice: (choice: number) => void;
  tallyVote: ({ updatedVotes }: { updatedVotes: {  [x: string]: number } }) => Promise<void>;
  setUniqueVotes: (choice: number) => void;
}

export const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export const CandidatesProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [minChoice, setMinChoiceState] = useState<number>(2);
  const [uniqueVotes, setUniqueVotesState] = useState<number>(0);

  const loadCandidates = async () => {
    const storedCandidates = await AsyncStorage.getItem('candidates');
    const storedVotes = await AsyncStorage.getItem('votes');
    const storedMinChoice = await AsyncStorage.getItem('minChoice');
    if (storedCandidates) setCandidates(JSON.parse(storedCandidates));
    if (storedVotes) setVotes(JSON.parse(storedVotes));
    if (storedMinChoice) setMinChoiceState(parseInt(storedMinChoice));
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
    }
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

  return (
    <CandidatesContext.Provider value={{ candidates, minChoice, votes, uniqueVotes, addCandidate, removeCandidate, setMinChoice, tallyVote, setUniqueVotes }}>
      {children}
    </CandidatesContext.Provider>
  );
};