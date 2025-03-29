
/**
 * AppNavigator Component
 * 
 * This component sets up the navigation structure for the application using React Navigation.
 * It includes a stack navigator with screens for Splash, Home, Create Task, and Edit Task.
 * The component is wrapped in a `GestureHandlerRootView` to enable gesture handling and 
 * a `NavigationContainer` to manage navigation state.
 * 
 * @component
 * @returns {JSX.Element} The navigation structure of the application.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash'>
          <Stack.Screen
            name='Splash'
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Create Task' component={CreateTaskScreen} />
          <Stack.Screen name='Edit Task' component={CreateTaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default AppNavigator;
