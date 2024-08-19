import React from 'react';
import { CandidatesProvider } from '@/app/(context)/CandidatesContext';

import { Slot, Stack } from "expo-router";

const RootLayout = () => {
  return (
    <CandidatesProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Slot />
      </Stack>
    </CandidatesProvider>
  );
};

export default RootLayout;

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function AuthStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="SignIn" component={SignInScreen} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} />
//     </Stack.Navigator>
//   );
// }

// function TabStack() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Admin" component={AdminScreen} />
//       <Tab.Screen name="Voter" component={VoterScreen} />
//     </Tab.Navigator>
//   );
// }

// export default function RootLayout() {
//   return (
//     <CandidatesProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Auth">
//           {/* <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} /> */}
//           <Stack.Screen name="Tabs" component={TabStack} options={{ headerShown: false }} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </CandidatesProvider>
//   );
// }