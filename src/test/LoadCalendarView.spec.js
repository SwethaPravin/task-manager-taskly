import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import LoadCalendarView from '../screens/LoadCalendarView';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllTasks } from '../database/TaskDatabase';
import moment from 'moment';

jest.mock('expo-sqlite');
jest.mock('../database/TaskDatabase');

const mockTasks = [
  { id: 1, name: 'Task 1', dueDate: '12-Mar-2025' },
  { id: 2, name: 'Task 2', dueDate: '13-Mar-2025' },
];

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn().mockImplementation(() => jest.fn()),
};

describe('LoadCalendarView', () => {
  const mockDatabase = {};

  beforeEach(() => {
    useSQLiteContext.mockReturnValue(mockDatabase);
    getAllTasks.mockResolvedValue(mockTasks);
  });

  test('renders calendar and tasks correctly', async () => {
    const { getByText } = render(<LoadCalendarView navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getAllTasks).toHaveBeenCalledWith(mockDatabase);
      expect(getByText('Tasks for')).toBeTruthy();
    });

    // Check for tasks rendered for today by default
    const todayFormatted = moment().format('DD MMM YYYY');
    expect(getByText(`Tasks for ${todayFormatted}`)).toBeTruthy();
  });

  test('renders tasks when date is selected', async () => {
    const { getByText, queryByText } = render(<LoadCalendarView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    const dateToSelect = '2025-03-12';
    const dateFormatted = moment(dateToSelect).format('DD MMM YYYY');

    fireEvent.press(getByText('12'));

    await waitFor(() => {
      expect(getByText(`Tasks for ${dateFormatted}`)).toBeTruthy();
      expect(getByText('Task 1')).toBeTruthy();
      expect(queryByText('Task 2')).toBeNull();
    });
  });

  test('navigates to edit task screen when task is pressed', async () => {
    const { getByText } = render(<LoadCalendarView navigation={mockNavigation} />);

    await waitFor(() => expect(getAllTasks).toHaveBeenCalledWith(mockDatabase));

    fireEvent.press(getByText('Task 1'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Edit Task', { taskId: 1 });
  });
});
