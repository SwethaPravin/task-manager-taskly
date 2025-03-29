/**
 * HomeScreen Component
 * 
 * This is the main screen of the task manager application. It allows users to switch between 
 * different views (List, Calendar, Kanban) and navigate to the "Create Task" screen. The component 
 * dynamically renders the content based on the selected view mode.
 * 
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.navigation - The navigation object provided by React Navigation for screen navigation.
 */

 /**
  * Renders the content of the HomeScreen based on the selected view mode.
  * 
  * @function
  * @returns {JSX.Element|null} - Returns the appropriate component (LoadListView, LoadCalendarView, or LoadKanbanView) 
  * based on the current view mode. Returns null if the view mode is invalid.
  */
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../../styles/styles';
import LoadListView from './LoadListView';
import LoadKanbanView from './LoadKanbanView';
import LoadCalendarView from './LoadCalendarView';

const HomeScreen = ({ navigation }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', or 'kanban'

  // Function to render content based on the selected view mode
  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return <LoadListView navigation={navigation} />;
      case 'calendar':
        return <LoadCalendarView navigation={navigation}/>;
      case 'kanban':
        return <LoadKanbanView navigation={navigation} />;
      default:
        return null;
    }
  };

  // Main container for the HomeScreen
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Button
          title='Create Task'
          onPress={() => navigation.navigate('Create Task')}
          color={'#403d3d'}
        />
      </View>
      
      <View style={styles.viewOptions}>
        <Button
          title='List'
          onPress={() => setViewMode('list')}
          color={viewMode === 'list' ? '#db5474' : 'gray'}
        />
        <Button
          title='Calendar'
          onPress={() => setViewMode('calendar')}
          color={viewMode === 'calendar' ? '#db5474' : 'gray'}
        />
        <Button
          title='Kanban'
          onPress={() => setViewMode('kanban')}
          color={viewMode === 'kanban' ? '#db5474' : 'gray'}
        />
      </View>
      
      {/* Render the content based on the selected view mode */}
      {renderContent()}
    </View>
  );
};

export default HomeScreen;
