/**
 * SplashScreen Component
 * 
 * This component represents the splash screen of the application. It displays
 * a background image and a title for the app while navigating to the 'Home' screen
 * after a delay of 2 seconds.
 * 
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.navigation - The navigation object provided by React Navigation.
 * 
 * @returns {JSX.Element} The rendered SplashScreen component.
 * 
 * @example
 * // Usage in a navigation stack
 * <Stack.Screen name="Splash" component={SplashScreen} />
 * 
 * @description
 * - The `useEffect` hook is used to set a timer that navigates to the 'Home' screen
 *   after 2 seconds.
 * - The `ImageBackground` component is used to display a full-screen background image.
 * - The `Text` component displays the app's title.
 * - The `StyleSheet` is used to define styles for the container and title.
 */
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { ImageBackground } from 'react-native';
import styles from '../../styles/styles';


const SplashScreen = ({ navigation }) => {
  // useEffect hook to navigate to the Home screen after a delay
  // This simulates a loading state or splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000); // Wait 2 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    // Main container for the splash screen
    <View style={[styles.containerSplashScreen, { flex: 1 }]}>
      {/* ImageBackground component to display the background image */}
      <ImageBackground
        source={require('../assets/background.png')}
        style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        resizeMode="stretch"
      >
        {/* Title text for the app */}
        <Text style={styles.titleSplashScreen}>Taskly </Text>
        <Text style={styles.titleSplashScreen}> The Task Manager</Text>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;
