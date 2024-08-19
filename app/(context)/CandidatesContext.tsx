import React, { createContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Candidate {
    id: number;
    name: string;
    image: string;
}

interface CandidatesContextType {
    candidates: Candidate[];
    minChoice: number;
    addCandidate: (name: string, image: string) => void;
    removeCandidate: (indexOrName: string) => void;
    setMinChoice: (choice: number) => void;
    votes: { [key: string]: number };
    tallyVote?: (name: string) => void;
}

export const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export const CandidatesProvider = ({ children }: { children: ReactNode }) => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [minChoice, setMinChoiceState] = useState<number>(1);
    const [votes, setVotes] = useState<{ [key: string]: number }>({});

    const loadCandidates = async () => {
        const storedCandidates = await AsyncStorage.getItem('candidates');
        const storedVotes = await AsyncStorage.getItem('votes');
        const storedMinChoice = await AsyncStorage.getItem('minChoice');
        if (storedCandidates) setCandidates(JSON.parse(storedCandidates));
        if (storedVotes) setVotes(JSON.parse(storedVotes));
        if (storedMinChoice) setMinChoice(parseInt(storedMinChoice));
    };

    React.useEffect(() => {
        loadCandidates();
    }, []);   

    const addCandidate = async (name: string, image: string) => {
        const newCandidate = { id: Date.now(), name, image };
        const updatedCandidates = [...candidates, newCandidate];
        setCandidates(updatedCandidates);
        setVotes({ ...votes, [name]: 0 });

        await AsyncStorage.setItem('candidates', JSON.stringify([...candidates, newCandidate]));
        await AsyncStorage.setItem('votes', JSON.stringify({ ...votes, [name]: 0 }));
    };

    const removeCandidate = async (indexOrName: string) => {
        let updatedCandidates = [...candidates];
        if (isNaN(Number(indexOrName))) {
            updatedCandidates = candidates.filter(candidate => candidate.name !== indexOrName);
        } else {
            updatedCandidates = candidates.filter((_, index) => index !== Number(indexOrName));
        }
        setCandidates(updatedCandidates);
        await AsyncStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    };

    const setMinChoice = async (choice: number) => {
        setMinChoiceState(choice);
        AsyncStorage.setItem('minChoice', choice.toString());
    };

    const tallyVote = async (name: string) => {
        const updateVotes = {...votes, [name]: (votes[name] || 0) + 1};
        setVotes(updateVotes);
        AsyncStorage.setItem('votes', JSON.stringify(updateVotes));
    };

    return (
        <CandidatesContext.Provider value={{ candidates, minChoice, addCandidate, removeCandidate, setMinChoice, votes, tallyVote }}>
            {children}
        </CandidatesContext.Provider>
    );
};

