// VoteChoiceContext.tsx
import React, { createContext, useEffect, useState, useContext } from 'react';
import { getVoteChoices, setMaxChoice, setMinChoice } from '@/scripts/API/voteChoiceAPI';

interface VoteChoiceType {
  minChoice: number;
  maxChoice: number;
  updateMinChoice: (val: number) => Promise<void>;
  updateMaxChoice: (val: number) => Promise<void>;
}

const VoteChoiceContext = createContext<VoteChoiceType | undefined>(undefined);

export const VoteChoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [minChoice, setLocalMin] = useState(1);
  const [maxChoice, setLocalMax] = useState(1);

  useEffect(() => {
    (async function loadData() {
      try {
        const { min_choice, max_choice } = await getVoteChoices();
        setLocalMin(min_choice || 1);
        setLocalMax(max_choice || 1);
      } catch (e) {
        console.error('Error loading vote choices:', e);
      }
    })();
  }, []);

  const updateMinChoice = async (val: number) => {
    await setMinChoice(val);
    setLocalMin(val);
  };

  const updateMaxChoice = async (val: number) => {
    await setMaxChoice(val);
    setLocalMax(val);
  };

  return (
    <VoteChoiceContext.Provider value={{ minChoice, maxChoice, updateMinChoice, updateMaxChoice }}>
      {children}
    </VoteChoiceContext.Provider>
  );
};

export const useChoiceContext = (): VoteChoiceType => {
  const context = useContext(VoteChoiceContext);
  if (!context) {
    throw new Error('useVoteChoice must be used within a VoteChoiceProvider');
  }
  return context;
};


