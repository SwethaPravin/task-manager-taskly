import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import { useSQLiteContext } from 'expo-sqlite';
import { addTask, updateTask, deleteTask, getTaskById } from '../database/TaskDatabase';

jest.mock('expo-sqlite');
jest.mock('../database/TaskDatabase');

const mockNavigation = {
  goBack: jest.fn(),
};

describe('CreateTaskScreen', () => {
  const mockDatabase = {};

  beforeEach(() => {
    useSQLiteContext.mockReturnValue(mockDatabase);
    jest.clearAllMocks();
  });

  test('renders correctly when adding a new task', () => {
    const { getByText } = render(<CreateTaskScreen navigation={mockNavigation} route={{}} />);

    expect(getByText('Add Task')).toBeTruthy();
    expect(getByText('Go Back')).toBeTruthy();
  });

  test('renders correctly when editing an existing task', async () => {
    getTaskById.mockResolvedValue({
      name: 'Test Task',
      description: 'Task Description',
      dueDate: '12-Mar-2025',
      statusId: 1,
      priorityId: 2,
    });

    const { getByDisplayValue, getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} route={{ params: { taskId: 1 } }} />
    );

    await waitFor(() => expect(getTaskById).toHaveBeenCalledWith(mockDatabase, 1));

    expect(getByDisplayValue('Test Task')).toBeTruthy();
    expect(getByDisplayValue('Task Description')).toBeTruthy();
    expect(getByText('Update Task')).toBeTruthy();
    expect(getByText('Delete Task')).toBeTruthy();
  });

  test('handles adding a new task', async () => {
    const { getByText, getByLabelText } = render(
      <CreateTaskScreen navigation={mockNavigation} route={{}} />
    );

    fireEvent.changeText(getByLabelText('Name'), 'New Task');
    fireEvent.changeText(getByLabelText('Description'), 'New Task Description');

    fireEvent.press(getByText('Add Task'));

    await waitFor(() => expect(addTask).toHaveBeenCalled());

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  test('handles updating an existing task', async () => {
    getTaskById.mockResolvedValue({
      name: 'Old Task',
      description: 'Old Description',
      dueDate: '12-Mar-2025',
      statusId: 0,
      priorityId: 1,
    });

    const { getByText, getByLabelText } = render(
      <CreateTaskScreen navigation={mockNavigation} route={{ params: { taskId: 1 } }} />
    );

    await waitFor(() => expect(getTaskById).toHaveBeenCalled());

    fireEvent.changeText(getByLabelText('Name'), 'Updated Task');

    fireEvent.press(getByText('Update Task'));

    await waitFor(() => expect(updateTask).toHaveBeenCalledWith(mockDatabase, expect.objectContaining({ name: 'Updated Task' })));

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  test('handles deleting a task with confirmation', async () => {
    getTaskById.mockResolvedValue({
      name: 'Task to Delete',
      description: 'Description',
      dueDate: '12-Mar-2025',
      statusId: 0,
      priorityId: 1,
    });

    const { getByText } = render(
      <CreateTaskScreen navigation={mockNavigation} route={{ params: { taskId: 1 } }} />
    );

    await waitFor(() => expect(getTaskById).toHaveBeenCalled());

    fireEvent.press(getByText('Delete Task'));

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(mockDatabase, 1);
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
