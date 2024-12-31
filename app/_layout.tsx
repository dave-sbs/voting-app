import React from 'react';
import { VotingProvider } from './(context)/VotingContext';

import { Slot, Stack } from "expo-router";
import '../global.css';
import { VoteChoiceProvider } from './(context)/VoteChoiceContext';
import { CandidateProvider } from './(context)/CandidateContext';

const RootLayout = () => {
  return (
    
    <CandidateProvider>
    <VotingProvider>
    <VoteChoiceProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Slot />
      </Stack>
    </VoteChoiceProvider>
    </VotingProvider>
    </CandidateProvider>
  );
};

export default RootLayout;

