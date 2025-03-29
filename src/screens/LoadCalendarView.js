/**
 * LoadCalendarView Component
 * 
 * This component renders a calendar view using the `react-native-calendars` library and displays tasks for the selected date.
 * It fetches tasks from a SQLite database and marks the dates with tasks on the calendar.
 * Users can select a date to view tasks for that specific day and navigate to edit a task.
 * 
 * Props:
 * @param {object} props - The props passed to the component.
 * @param {object} props.navigation - The navigation object provided by React Navigation.
 * 
 * State:
 * @state {object} markedDates - An object containing the marked dates for the calendar.
 * @state {string} selectedDate - The currently selected date in 'YYYY-MM-DD' format.
 * @state {Array} tasks - The list of tasks fetched from the database.
 */

 /**
  * useEffect Hook - Adds a listener to fetch tasks when the screen gains focus.
  * 
  * Dependencies:
  * - `navigation`: Ensures the listener is re-added when the navigation object changes.
  * - `database`: Ensures tasks are fetched when the database context changes.
  */

 /**
  * useEffect Hook - Fetches tasks from the database when the component mounts or the database context changes.
  * 
  * Dependencies:
  * - `database`: Ensures tasks are fetched when the database context changes.
  */

 /**
  * fetchTasks - Fetches all tasks from the SQLite database and updates the state.
  * 
  * @async
  * @function
  * @returns {Promise<void>} - A promise that resolves when tasks are fetched and state is updated.
  */

 /**
  * formatTasks - Formats the tasks into a marked dates object for the calendar.
  * 
  * @function
  * @param {Array} tasks - The list of tasks to format.
  * @param {string} selected - The currently selected date in 'YYYY-MM-DD' format.
  * @returns {object} - An object containing marked dates for the calendar.
  */

 /**
  * onDayPress - Handles the event when a day is pressed on the calendar.
  * 
  * @function
  * @param {object} day - The day object provided by the calendar library.
  * @param {string} day.dateString - The selected date in 'YYYY-MM-DD' format.
  */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSQLiteContext } from 'expo-sqlite';
import moment from 'moment';
import { getAllTasks } from '../database/TaskDatabase';
import styles from '../../styles/styles';
const LoadCalendarView = (props) => {
  const { navigation } = props;
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [tasks, setTasks] = useState([]);
  const database = useSQLiteContext();

  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      fetchTasks();
    });

    return unsubscribe;
  }, [navigation, database]);

  useEffect(() => {
    async function setup() {
      fetchTasks();
    }
    setup();
  }, [database]);

  // Fetch tasks from the database
  // and set marked dates for the calendar
  const fetchTasks = async () => {
    const tasksFromDB = await getAllTasks(database);
    setTasks(tasksFromDB);
    setMarkedDates(formatTasks(tasksFromDB, selectedDate));
  };

  // Format tasks into marked dates for the calendar
  // This function takes the tasks and the selected date
  // and returns an object that can be used to mark dates in the calendar
  const formatTasks = (tasks, selected) => {
    const marked = {};
     // Mark dates with tasks
     tasks.forEach(task => {
      const date = moment(task.dueDate, 'DD-MMM-YYYY').format('YYYY-MM-DD');     
      marked[date] = {
        marked: true,
        selected: true,
        selectedColor: '#f8786b',
      };
    });

    // Always override selected date 
    marked[selected] = {
      selected: true,
      marked: true,
      selectedColor: '#e8879e',
    };
    
    return marked;
  };

  // Handle day press event
  // This function updates the selected date and marks the tasks for that date
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setMarkedDates(formatTasks(tasks, day.dateString));
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'multi-dot'}
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          backgroundColor: 'white',
          calendarBackground: 'white',
          textSectionTitleColor: 'black',
          selectedDayBackgroundColor: '#257574',
          selectedDayTextColor: 'white',
          todayTextColor: '#f8786b',
          dayTextColor: 'black',
          monthTextColor: 'black',
          textDisabledColor: 'gray',
          arrowColor: 'gray',
        }}
      />

      <View style={styles.taskListContainer}>
        <Text style={styles.headerText}>Tasks for {moment(selectedDate).format('DD MMM YYYY')}</Text>
        {tasks
          .filter(t => moment(t.dueDate, 'DD-MMM-YYYY').toDate().toDateString() === moment(selectedDate).toDate().toDateString())
          .map(task => (
            <View key={task.id} style={styles.taskItem}>
              <TouchableOpacity
                    onPress={() => navigation.navigate('Edit Task', { taskId: task.id })}
                  >
              <Text style={styles.taskText}>{task.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </View>
  );
};
export default LoadCalendarView;
