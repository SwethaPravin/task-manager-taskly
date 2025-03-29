/**
 * LoadListView Component
 * 
 * This component is responsible for displaying a list of tasks fetched from the database.
 * It allows users to view task details, navigate to an edit screen, and delete tasks.
 * The task list is refreshed whenever the screen gains focus or a task is deleted.
 * 
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.navigation - The navigation object used for screen navigation.
 */

 /**
  * useEffect - Focus Listener
  * 
  * Sets up a listener that triggers whenever the screen gains focus.
  * Fetches all tasks from the database and updates the state.
  * 
  * Dependencies: [navigation, database]
  */

 /**
  * useEffect - Initial Setup
  * 
  * Fetches all tasks from the database when the component is first mounted.
  * Updates the state with the fetched tasks.
  * 
  * Dependencies: [database]
  */

 /**
  * deleteSelectedTask
  * 
  * Deletes a task from the database after user confirmation.
  * Refreshes the task list after the task is deleted.
  * 
  * @async
  * @function
  * @param {number} id - The ID of the task to be deleted.
  */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSQLiteContext } from 'expo-sqlite';
import styles from '../../styles/styles';
import { getAllTasks, deleteTask } from '../database/TaskDatabase';
import { getStatusText, getPriorityText } from '../utils/utils';

const LoadListView = (props) => {
  const { navigation } = props;
  const [tasks, setTasks] = useState([]);
  const database = useSQLiteContext();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const result = await getAllTasks(database);
      setTasks(result);
    });

    return unsubscribe;
  }, [navigation, database]);

  useEffect(() => {
    async function setup() {
      const result = await getAllTasks(database);
      setTasks(result);
    }
    setup();
  }, [database]);

  const deleteSelectedTask = async (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          // Delete the task from the database
          await deleteTask(database, id);
          // Refresh the task list after deletion
          const result = await getAllTasks(database);
          setTasks(result);
        },
      },
    ]);
  };

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.taskItemContainer} key={item.id}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Edit Task', { taskId: item.id })}
          >
            <Text style={styles.taskNameText}>
              {`${item.name} - ${getStatusText(item.statusId)} - ${getPriorityText(item.priorityId)}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteSelectedTask(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default LoadListView;
