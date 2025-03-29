import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoadListView from '../screens/LoadListView';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllTasks, deleteTask } from '../database/TaskDatabase';
import { getStatusText, getPriorityText } from '../utils/utils';

jest.mock('expo-sqlite');
jest.mock('../database/TaskDatabase');
jest.mock('../utils/utils');

const mockTasks = [
  { id: 1, name: 'Task 1', statusId: 0, priorityId: 1 },
  { id: 2, name: 'Task 2', statusId: 1, priorityId: 2 },
];

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn().mockImplementation(() => jest.fn()),
};

getStatusText.mockImplementation(statusId => ['Pending', 'In Progress', 'Completed'][statusId]);
getPriorityText.mockImplementation(priorityId => ['Low', 'Medium', 'High'][priorityId]);

describe('LoadListView', () => {
  const mockDatabase = {};

  beforeEach(() => {
    useSQLiteContext.mockReturnValue(mockDatabase);
    getAllTasks.mockResolvedValue(mockTasks);
  });

  test('renders tasks correctly', async () => {
    const { getByText } = render(<LoadListView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    expect(getByText('Task 1 - Pending - Medium')).toBeTruthy();
    expect(getByText('Task 2 - In Progress - High')).toBeTruthy();
  });

  test('navigates to edit task screen when task is pressed', async () => {
    const { getByText } = render(<LoadListView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    fireEvent.press(getByText('Task 1 - Pending - Medium'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Edit Task', { taskId: 1 });
  });

  test('deletes task after confirmation', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => buttons[1].onPress());

    const { getByText } = render(<LoadListView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(mockDatabase, 1);
      expect(getAllTasks).toHaveBeenCalledTimes(2);
    });

    Alert.alert.mockRestore();
  });
});
