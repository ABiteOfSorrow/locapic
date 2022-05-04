import React from "react";

import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import ChatScreen from "./screens/ChatScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { Ionicons } from "@expo/vector-icons";

import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import pseudo from "./reducers/pseudo";

const store = createStore(combineReducers({ pseudo }));

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomMenuTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = "navigate";
          } else if (route.name === "Chat") {
            iconName = "chatbubbles-sharp";
          }
          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#eb4d4b",
        inactiveTintColor: "#FFFFFF",
        style: {
          backgroundColor: "#130f40",
        },
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BottomMenuTabs" component={BottomMenuTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
