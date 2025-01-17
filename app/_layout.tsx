import '../global.css';
import React from 'react';
import { Slot, Stack } from "expo-router";

import { VotingProvider } from './(context)/VotingContext';
import { VoteChoiceProvider } from './(context)/VoteChoiceContext';
import { CandidateProvider } from './(context)/CandidateContext';
import { EventProvider } from './(context)/EventContext';

const RootLayout = () => {
  return (
    
    <CandidateProvider>
    <VotingProvider>
    <EventProvider>
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
    </EventProvider>
    </VotingProvider>
    </CandidateProvider>
  );
};

export default RootLayout;

