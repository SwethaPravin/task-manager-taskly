/**
 * CreateTaskScreen Component
 * 
 * This component allows users to create, update, or delete tasks. It provides a form for entering task details such as name, description, due date, status, and priority.
 * The component also supports editing an existing task if a `taskId` is provided via navigation parameters.
 * 
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.navigation - The navigation object provided by React Navigation.
 * @param {Object} props.route - The route object provided by React Navigation, containing parameters such as `taskId`.
 */

 /**
  * useEffect Hook
  * 
  * Loads task data if a `taskId` is provided. Fetches the task details from the database and populates the form fields.
  * 
  * @function
  * @async
  * @param {string} taskId - The ID of the task to be loaded (optional).
  * @param {Object} database - The SQLite database context.
  */

 /**
  * handleSubmit Function
  * 
  * Validates the input fields and either adds a new task or updates an existing task in the database.
  * Resets the form fields after successful submission and navigates back to the previous screen.
  * 
  * @function
  * @async
  * @throws Will alert the user if the task could not be added or updated.
  */

 /**
  * handleDelete Function
  * 
  * Deletes the current task from the database if a `taskId` is provided. Prompts the user for confirmation before deletion.
  * Navigates back to the previous screen after deletion.
  * 
  * @function
  * @async
  * @throws Will alert the user if the task could not be deleted.
  */

 /**
  * DateTimePicker Component
  * 
  * Displays a date picker for selecting the due date of the task. Updates the `dueDate` state with the selected date.
  * 
  * @component
  * @param {Object} event - The event object from the date picker.
  * @param {Date} selectedDate - The date selected by the user.
  */

 /**
  * Picker Component
  * 
  * Provides dropdown menus for selecting the task's status and priority. Updates the respective state variables (`statusId` and `priorityId`) based on user selection.
  * 
  * @component
  * @param {number} selectedValue - The currently selected value.
  * @param {function} onValueChange - Callback function to update the state when a new value is selected.
  */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { addTask, getTaskById, updateTask, deleteTask } from '../database/TaskDatabase'; // Function to insert task into your database
import { useSQLiteContext } from 'expo-sqlite';
import styles from '../../styles/styles';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateTaskScreen = ({ navigation, route }) => {
  const { taskId } = route.params || {};
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(moment().format('DD-MMM-YYYY'));
  const [statusId, setStatusId] = useState(0);   // Default status (Pending)
  const [priorityId, setPriorityId] = useState(0); // Default priority ( Low)
  const [showDatePicker, setShowDatePicker] = useState(false);

  const database = useSQLiteContext();

  // Load task data if taskId is provided
  // This effect runs when the component mounts or when taskId changes
  useEffect(() => {
    if (taskId) {
      // Load existing task data if taskId is provided
      const loadTaskData = async () => {
        try {
          const task = await getTaskById(database, taskId); // Assuming you have a function to fetch task by ID
          if (task) {
            setName(task.name);
            setDescription(task.description);
            setDueDate(task.dueDate);
            setStatusId(task.statusId);
            setPriorityId(task.priorityId);
          }
        } catch (error) {
          console.error('Failed to load task data:', error);
          alert('Failed to load task data. Please try again.');
        }
      };

      loadTaskData();
    }
  }, [taskId, database]);

  // Function to handle form submission
  // This function is called when the user clicks the "Add Task" or "Update Task" button
  const handleSubmit = () => {
    // Validate input and then save task
    if (name.trim() === '' || description.trim() === '') {
      alert('Please fill in both the name and description fields.');
      return;
    }
    try {
      if (taskId) {
        // Update existing task
        updateTask(database, {
          id: taskId,
          name,
          description,
          dueDate,
          statusId,
          priorityId,
        });
      } else {
        // Add new task
        addTask(database, { name, description, dueDate, statusId, priorityId });
      }
      // Reset form fields
      setDescription('');
      setName('');
      setDueDate('');
      setPriorityId(1);
      setStatusId(1);

    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task. Please try again.');
    }

    navigation.goBack();
  };

  // Function to handle task deletion
  // This function is called when the user clicks the "Delete Task" button
  const handleDelete = async () => {
    if (!taskId) {
      navigation.goBack();
      return;
    }
    // Confirm deletion
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          // Delete the task from the database
          await deleteTask(database, taskId);
          navigation.goBack();
          return;
        },
      },
    ]);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Due Date</Text>
      <Button title={dueDate} style={styles.datePickerText} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          style={styles.datePickerButton}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || new Date();
            setShowDatePicker(false);
            setDueDate(moment(currentDate).format('DD-MMM-YYYY'));
          }}
        />
      )}
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={statusId}
          onValueChange={(itemValue) => setStatusId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Pending" value={0} />
          <Picker.Item label="In Progress" value={1} />
          <Picker.Item label="Completed" value={2} />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Priority</Text>
        <Picker
          selectedValue={priorityId}
          onValueChange={(itemValue) => setPriorityId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Low" value={0} />
          <Picker.Item label="Medium" value={1} />
          <Picker.Item label="High" value={2} />
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          {taskId ? (
            <Text style={styles.taskButtonText}>Update Task</Text>
          ) : (
            <Text style={styles.taskButtonText}>Add Task</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDelete}
        >
          {taskId ? (
            <Text style={styles.taskButtonText}>Delete Task</Text>
          ) : (
            <Text style={styles.taskButtonText}>Go Back</Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default CreateTaskScreen;
