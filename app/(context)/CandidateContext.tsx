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
} from '@/scripts/API/candidateAPI'

// Interface for summary data
interface SummaryProps {
    name: string,
    vote_count: number,
}

// Props for the CandidateContext
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

// Create the CandidateContext with default values
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

// Props for the CandidateProvider component
interface CandidateProviderProps {
    children: ReactNode;
}

// CandidateProvider component
export const CandidateProvider: React.FC<CandidateProviderProps> = ({ children }) => {
    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [summary, setSummary] = useState<SummaryProps[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch candidates from the API
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

    // Add a new candidate
    const addCandidate = useCallback(async (candidate: Candidate) => {
        setIsLoading(true);
        setError(null);
        try {
            await insertNewCandidate(candidate);
            await fetchCandidates();
        } catch (err: any) {
            setError(err.message);
            throw err; // Re-throw to let the form handle the error UI
        } finally {
            setIsLoading(false);
        }
    }, [fetchCandidates]);

    // Delete a candidate
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

    // Clear all candidates
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

    // Summarize voting data
    // Returns Candidate Name + Vote Count data
    const summarizeData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try{
            const activeCandidates = await getActiveCandidates();
            
            const summarizedData = activeCandidates.map(candidate => ({
                name: candidate.name,
                vote_count: candidate.vote_count
            }));
    
            setSummary(summarizedData);
            return summarizedData;
        } catch (err: any) {
            console.error(err)
            setError(err.message || `Failed to fetch candidate data`)
            return null
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch candidates on component mount
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

// Custom hook to use the CandidateContext
export function useCandidateContext() {
    return useContext(CandidateContext);
}