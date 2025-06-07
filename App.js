import React from "react";
import { StatusBar, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#357bd2" barStyle="light-content" />
      <Routes />
    </NavigationContainer>
  );
}
