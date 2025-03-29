// Create tables for Status, Priority, and Tasks
export const createDBIfNotExists = async (db) => {
  try {
    const result = await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      dueDate DATETIME,
      statusId INTEGER,
      priorityId INTEGER
    );`);

    // await db.runAsync('Insert into Tasks (name, description, dueDate, statusId, priorityId) VALUES (?, ?, ?, ?, ?)','Task 1', 'Description 1', '2022-01-01', 0, 0);
    // await db.runAsync('Insert into Tasks (name, description, dueDate, statusId, priorityId) VALUES (?, ?, ?, ?, ?)','Task 2', 'Description 2', '2022-01-02', 1, 1);
    // await db.runAsync('Insert into Tasks (name, description, dueDate, statusId, priorityId) VALUES (?, ?, ?, ?, ?)','Task 3', 'Description 3', '2022-01-03', 2, 2);

    console.log(result);
  } catch (error) {
    console.log('Error creating tables:', error);
  }
};

// Get all tasks
export const getAllTasks = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM Tasks');
    return result;
  } catch (error) {
    console.error('Error getting tasks:', error);
  }
};

// Insert a new task
export const addTask = async (
  db,
  { name, description, dueDate, statusId, priorityId }
) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO Tasks (name, description, dueDate, statusId, priorityId) VALUES (?, ?, ?, ?, ?)',
      [name, description, dueDate, statusId, priorityId]
    );
    console.log(result);
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// delete a task
export const deleteTask = async (db, id) => {
  try {
    const result = await db.runAsync('DELETE FROM Tasks WHERE id = ?', id);
    console.log('Deleted task with id: ', id);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export const updateTaskStatus = async (db, taskId, statusId) => {
  try {
    const result = await db.runAsync(
      'UPDATE Tasks SET statusId = ? WHERE id = ?',
      [statusId, taskId]
    );
    console.log(`Updated task ${taskId} with status ${statusId}`, result);
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};

export const getTaskById = async (db, taskId) => {
  try {
    const result = await db.getFirstAsync('SELECT * FROM Tasks WHERE id = ?', taskId);
    return result;
  } catch (error) {
    console.error('Error getting task by ID:', error);
  }
}

export const updateTask = async (
  db,
  { id, name, description, dueDate, statusId, priorityId }
) => {
  try {
    const result = await db.runAsync(
      'UPDATE Tasks SET name = ?, description = ?, dueDate = ?, statusId = ?, priorityId = ? WHERE id = ?',
      [name, description, dueDate, statusId, priorityId, id]
    );
    console.log(result);
  } catch (error) {
    console.error('Error updating task:', error);
  }
}
