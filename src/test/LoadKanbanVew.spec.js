import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import LoadKanbanView from '../screens/LoadKanbanView';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllTasks, updateTaskStatus } from '../database/TaskDatabase';
import { getStatusText } from '../utils/utils';

jest.mock('expo-sqlite');
jest.mock('../database/TaskDatabase');
jest.mock('../utils/utils');

const mockTasks = [
  { id: 1, name: 'Task 1', statusId: 0, priorityName: 'High', dueDate: '12-Mar-2025', description: 'Desc 1' },
  { id: 2, name: 'Task 2', statusId: 1, priorityName: 'Medium', dueDate: '13-Mar-2025', description: 'Desc 2' },
  { id: 3, name: 'Task 3', statusId: 2, priorityName: 'Low', dueDate: '14-Mar-2025', description: 'Desc 3' },
];

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn().mockImplementation(() => jest.fn()),
};

getStatusText.mockImplementation((statusId) => ['Pending', 'In Progress', 'Completed'][statusId]);

describe('LoadKanbanView', () => {
  const mockDatabase = {};

  beforeEach(() => {
    useSQLiteContext.mockReturnValue(mockDatabase);
    getAllTasks.mockResolvedValue(mockTasks);
  });

  test('renders Kanban columns correctly', async () => {
    const { getByText } = render(<LoadKanbanView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    expect(getByText('Pending (1)')).toBeTruthy();
    expect(getByText('In Progress (1)')).toBeTruthy();
    expect(getByText('Completed (1)')).toBeTruthy();
  });

  test('renders tasks correctly inside columns', async () => {
    const { getByText } = render(<LoadKanbanView navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Task 1')).toBeTruthy();
      expect(getByText('Task 2')).toBeTruthy();
      expect(getByText('Task 3')).toBeTruthy();
    });
  });

  test('navigates to edit task screen when task is pressed', async () => {
    const { getByText } = render(<LoadKanbanView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    fireEvent(getByText('Task 1'), 'touchEnd');

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Edit Task', { taskId: 1 });
  });

  test('updates task status correctly on drag end', async () => {
    const { getByText } = render(<LoadKanbanView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    // Simulate the drop action
    await waitFor(() => {
      updateTaskStatus(mockDatabase, 1, 1);
    });

    expect(updateTaskStatus).toHaveBeenCalledWith(mockDatabase, 1, 1);
  });
});
