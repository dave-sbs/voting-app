import React from 'react';
import { VotingProvider } from './(context)/VotingContext';

import { Slot, Stack } from "expo-router";
import '../global.css';
import { VoteChoiceProvider } from './(context)/VoteChoiceContext';

const RootLayout = () => {
  return (
    
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
  );
};

export default RootLayout;

