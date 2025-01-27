import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback
} from 'react';

import {
    Candidate,
    getActiveCandidates,
    insertNewCandidate,
    removeCandidate,
    clearActiveCandidates
} from '@/scripts/candidateAPI'


interface SummaryProps {
    name: string,
    vote_count: number,
}

interface CandidateContextProps {
    candidates: Candidate[] | null;
    summary: SummaryProps[] | null;
    isLoading: boolean;
    error: string | null;
    fetchCandidates: () => Promise<void>;
    addCandidate: (candidate: Candidate) => Promise<void>;
    deleteCandidate: (candidate: Candidate) => Promise<void>;
    clearCandidates: () => Promise<void>;
    summarizeData: () => Promise<SummaryProps[] | null>;
}

const CandidateContext = createContext<CandidateContextProps>({
    candidates: null,
    summary: null,
    isLoading: false,
    error: null,
    fetchCandidates: async() => undefined,
    addCandidate: async () => undefined,
    deleteCandidate:async () => undefined,
    clearCandidates:async () => undefined,
    summarizeData:async () => null,
});


interface CandidateProviderProps {
    children: ReactNode;
}

export const CandidateProvider: React.FC<CandidateProviderProps> = ({ children }) => {
    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [summary, setSummary] = useState<SummaryProps[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
    }, 
    []);

    const addCandidate = useCallback(async (candidate: Candidate) => {
        setIsLoading(true);
        setError(null);
        console.log("START")
        try {
            console.log("ADDING CANDIDATE")
            await insertNewCandidate(candidate);
            console.log("INSERTION COMPOLETED")
            await fetchCandidates();
        } catch (err: any) {
            console.log("NOT SUCCESSFUL")
            console.error(err);
            setError(err.message || 'Failed to add candidates')
        } finally {
            console.log("COMPLETED ADDING CANDIDATE")
            setIsLoading(false);
        }
    }, [fetchCandidates]);

    const deleteCandidate = useCallback(async (candidate: Candidate) => {
        setIsLoading(true);
        setError(null);
        try{
            await removeCandidate(candidate);
            await fetchCandidates();
        } catch(err: any) {
            console.error(err);
            setError(err.message || `Failed to remove candidate ${candidate.name}`)
        } finally {
            setIsLoading(false);
        }
    }, [fetchCandidates]);

    const clearCandidates = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try{
            await clearActiveCandidates();
            await fetchCandidates();
        } catch(err: any) {
            console.error(err);
            setError(err.message || `Failed to clear table`);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCandidates]);

    const summarizeData = useCallback(async () => {
        const activeCandidates = await getActiveCandidates();
        // LOGGING THE SUMMARY PROCESS
        console.log("SUMMARIZING DATA");
        console.log(activeCandidates);

        const summarizedData = activeCandidates.map(candidate => ({
            name: candidate.name,
            vote_count: candidate.vote_count
        }));

        setSummary(summarizedData);
        return summarizedData;
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    return (
        <CandidateContext.Provider
            value={{
                candidates,
                summary,
                isLoading,
                error,
                fetchCandidates,
                addCandidate,
                deleteCandidate,
                clearCandidates,
                summarizeData
            }}
        > 
            {children}
        </CandidateContext.Provider>
    );
};

export function useCandidateContext() {
    return useContext(CandidateContext);
}