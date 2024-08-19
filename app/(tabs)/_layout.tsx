import React from 'react';
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="Admin"
        options={{
          title: "Admin",
        }}
      />
      <Tabs.Screen
        name="Voter"
        options={{
          title: "Voter",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;