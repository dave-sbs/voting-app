import React from 'react';
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
  );
};

export default TabsLayout;