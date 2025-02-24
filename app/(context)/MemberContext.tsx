import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback
} from 'react';

import {
    Member,
    getOrganizationMembers,
    addOrganizationMember,
    removeOrganizationMember,
    updateBoardMemberStatus
} from '@/scripts/API/memberAPI';

interface MemberContextProps {
    members: Member[] | null;
    isLoading: boolean;
    error: string | null;
    fetchMembers: () => Promise<Member[] | null>;
    addMember: (name: string, storeNumber: string) => Promise<void>;
    removeMember: (name: string, storeNumber: string) => Promise<void>;
    updateBoardStatus: (name: string, storeNumber: string, isBoardMember: boolean) => Promise<void>;
}

const MemberContext = createContext<MemberContextProps>({
    members: null,
    isLoading: false,
    error: null,
    fetchMembers: async () => null,
    addMember: async () => undefined,
    removeMember: async () => undefined,
    updateBoardStatus: async () => undefined,
});

interface MemberProviderProps {
    children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
    const [members, setMembers] = useState<Member[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getOrganizationMembers();
            setMembers(result);
            return result;
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch members');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addMember = useCallback(async (name: string, storeNumber: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await addOrganizationMember(name, storeNumber);
            await fetchMembers();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchMembers]);

    const removeMember = useCallback(async (name: string, storeNumber: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await removeOrganizationMember(name, storeNumber);
            await fetchMembers();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchMembers]);

    const updateBoardStatus = useCallback(async (name: string, storeNumber: string, isBoardMember: boolean) => {
        setIsLoading(true);
        setError(null);
        try {
            await updateBoardMemberStatus(name, storeNumber, isBoardMember);
            await fetchMembers();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchMembers]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    return (
        <MemberContext.Provider
            value={{
                members,
                isLoading,
                error,
                fetchMembers,
                addMember,
                removeMember,
                updateBoardStatus,
            }}
        >
            {children}
        </MemberContext.Provider>
    );
};

export const useMemberContext = () => useContext(MemberContext);
