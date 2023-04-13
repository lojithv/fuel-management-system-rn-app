import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import Requests from "./pages/Requests";
import FuelAmount from "./pages/FuelAmount";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Signin"
          component={Login}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Confirm" component={FuelAmount}/>
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Requests" component={Requests} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}