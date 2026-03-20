import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddProductScreen from './screens/AddProductScreen';

const Stack = createStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLogin={setToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {props => <HomeScreen {...props} token={token} />}
            </Stack.Screen>
            <Stack.Screen name="AddProduct">
              {props => <AddProductScreen {...props} token={token} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}