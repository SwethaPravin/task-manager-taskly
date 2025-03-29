import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

jest.mock('../screens/LoadListView', () => 'LoadListView');
jest.mock('../screens/LoadCalendarView', () => 'LoadCalendarView');
jest.mock('../screens/LoadKanbanView', () => 'LoadKanbanView');

describe('HomeScreen', () => {
  const mockNavigation = { navigate: jest.fn() };

  test('renders correctly with List view by default', () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('Tasks')).toBeTruthy();
    expect(getByText('List')).toBeTruthy();
    expect(getByText('Calendar')).toBeTruthy();
    expect(getByText('Kanban')).toBeTruthy();

    // Should render LoadListView by default
    expect(queryByText('LoadListView')).toBeTruthy();
  });

  test('switches to Calendar view correctly', () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Calendar'));

    expect(queryByText('LoadCalendarView')).toBeTruthy();
  });

  test('switches to Kanban view correctly', () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Kanban'));

    expect(queryByText('LoadKanbanView')).toBeTruthy();
  });

  test('navigates to Create Task screen on button press', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Create Task'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Create Task');
  });

  test('toggles between views correctly', () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Kanban'));
    expect(queryByText('LoadKanbanView')).toBeTruthy();

    fireEvent.press(getByText('Calendar'));
    expect(queryByText('LoadCalendarView')).toBeTruthy();

    fireEvent.press(getByText('List'));
    expect(queryByText('LoadListView')).toBeTruthy();
  });
});