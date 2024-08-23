// app/auth/_layout.tsx
import React from 'react';
import { Stack, Slot } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="SignIn"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="SignUp"
        options={{
          title: "",
        }}
      />
      <Slot />
    </Stack>
  );
};

export default AuthLayout;