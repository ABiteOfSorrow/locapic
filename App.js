import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

import React from "react";

import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import ChatScreen from "./screens/ChatScreen";
import POIScreen from "./screens/POIScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { Ionicons } from "@expo/vector-icons";

import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import pseudo from "./reducers/pseudo";
import listPOI from "./reducers/listPOI";


const store = createStore(combineReducers({ pseudo, listPOI }));

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
          } else if (route.name === "POI") {
            iconName = "location";
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
      <Tab.Screen name="POI" component={POIScreen} />
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
