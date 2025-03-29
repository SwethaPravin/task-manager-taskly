import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SQLiteProvider } from 'expo-sqlite';
import { createDBIfNotExists } from './src/database/TaskDatabase';

export default function App() {
  return (
    <SQLiteProvider databaseName='taskly.db' onInit={createDBIfNotExists}>
      <AppNavigator />
    </SQLiteProvider>
  );
}
