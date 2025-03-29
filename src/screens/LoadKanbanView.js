/**
 * LoadKanbanView Component
 * 
 * This component renders a Kanban board view for tasks, allowing users to drag and drop tasks
 * between different status columns. It uses React Native, Reanimated, and Gesture Handler libraries
 * to provide smooth animations and gesture handling. The tasks are fetched from a SQLite database
 * and grouped by their status.
 * 
 * Props:
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object provided by React Navigation.
 * 
 * Dependencies:
 * - React Native
 * - React Native Gesture Handler
 * - React Native Reanimated
 * - Expo SQLite
 * - TaskDatabase (custom database utility)
 * - utils (custom utility functions)
 */
 
/**
 * Groups tasks by their status for rendering in the Kanban board.
 * 
 * @returns {Array} An array of grouped tasks, where each group contains:
 * - status: The status name (e.g., 'Pending', 'In Progress', 'Completed').
 * - statusId: The ID of the status.
 * - tasks: An array of tasks belonging to the status.
 */

/**
 * DraggableTask Component
 * 
 * A draggable task card that allows users to drag and drop tasks between Kanban columns.
 * 
 * Props:
 * @param {object} props - The component props.
 * @param {object} props.task - The task object containing task details.
 * @param {function} props.onDrop - Callback function triggered when the task is dropped into a new column.
 * 
 * Gesture Handling:
 * - Allows dragging the task horizontally to change its status.
 * - Uses Reanimated's gesture handler to track and animate the drag movement.
 */

/**
 * Handles the rendering of a single Kanban column.
 * 
 * @param {object} item - The column data containing:
 * - status: The status name (e.g., 'Pending', 'In Progress', 'Completed').
 * - statusId: The ID of the status.
 * - tasks: An array of tasks belonging to the status.
 * 
 * @returns {JSX.Element} A column view containing the status header and a list of tasks.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
  FlatList,
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { useSQLiteContext } from 'expo-sqlite';
import styles from '../../styles/styles';
import { getAllTasks, updateTaskStatus } from '../database/TaskDatabase';
import { getStatusText } from '../utils/utils';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const LoadKanbanView = (props) => {
  const { navigation } = props;
  const [tasks, setTasks] = useState([]);
  const database = useSQLiteContext();

  const { width } = Dimensions.get('window');
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
  }, [database, setTasks]);

  // Group tasks by status for Kanban
  const groupTasksByStatus = () => {
    const statuses = ['Pending', 'In Progress', 'Completed']; // Match your seeded statuses
    const grouped = statuses.map((status) => ({
      status,
      statusId: statuses.indexOf(status),
      tasks: tasks.filter((task) => getStatusText(task.statusId) === status),
    }));
    return grouped;
  };

  const DraggableTask = ({ task, onDrop }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const handleDrop = (taskId, newStatusId) => {
      updateTaskStatus(database, taskId, newStatusId);
      onDrop();
    };

    const initialColumnIndex = task.statusId;

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
        ctx.startY = translateY.value;
      },
      onActive: (event, ctx) => {
        translateX.value = ctx.startX + event.translationX;
        translateY.value = ctx.startY + event.translationY;
      },
      onEnd: async () => {
        const columnWidth = width * 0.8;
        // Compute how many columns you've moved (+ or -)
        const deltaColumn = Math.round(translateX.value / columnWidth);

        // Calculate the correct new column index
        let newColumnIndex = initialColumnIndex + deltaColumn;

        // Clamp index between 0 and 2
        newColumnIndex = Math.max(0, Math.min(newColumnIndex, 2));

        const newStatusId = newColumnIndex;

        runOnJS(handleDrop)(task.id, newStatusId);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      zIndex: 10,
      elevation: 10,
    }));

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[styles.taskCard, animatedStyle]}
          onTouchEnd={() => navigation.navigate('Edit Task', { taskId: task.id })}
        >
          <Text style={styles.taskTitle}>{task.name}</Text>
          <Text>
            {task.priorityName}
          </Text>
          <Text>
            Due: {task.dueDate}
          </Text>
          {task.description ? <Text>{task.description}</Text> : null}
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const renderKanbanColumn = ({ item }) => {
    return (

      <View style={[styles.column, { zIndex: -(item.statusId + 1), elevation: 5 }]}>
        <Text style={styles.columnHeader}>
          {item.status} ({item.tasks.length})
        </Text>
        <FlatList
          data={item.tasks}
          keyExtractor={(task) => task.id.toString()}
          renderItem={({ item }) => (
            <DraggableTask task={item} onDrop={async () => {
              const refreshedTasks = await getAllTasks(database);
              setTasks(refreshedTasks);
            }} />
          )}
          style={styles.taskList}
        />
      </View>
    )
  };

  return (
    <GestureHandlerRootView style={styles.kanbanContainer}>
      <FlatList
        data={groupTasksByStatus()}
        keyExtractor={(item) => item.status}
        renderItem={renderKanbanColumn}
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.kanbanContainer}
      />
    </GestureHandlerRootView>
  );
};

export default LoadKanbanView;
