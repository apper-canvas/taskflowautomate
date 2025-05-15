/**
 * Task service handling all CRUD operations for tasks
 * Using ApperClient to communicate with the backend
 */

// Task fields mapping
const TASK_TABLE = 'task';

// Fetch all tasks for the current user
export const fetchTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "dueDate" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "completed" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "ModifiedOn" } },
        { Field: { Name: "Owner" } }
      ],
      orderBy: [
        { 
          field: "CreatedOn", 
          direction: "desc" 
        }
      ]
    };

    const response = await apperClient.fetchRecords(TASK_TABLE, params);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord(TASK_TABLE, taskData);
    return response?.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const updatedTask = {
      Id: taskId,
      ...taskData
    };

    const response = await apperClient.updateRecord(TASK_TABLE, updatedTask);
    return response?.data;
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

// Toggle task completion status
export const toggleTaskCompletion = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // First get the current task to check its completion status
    const task = await apperClient.getRecordById(TASK_TABLE, taskId);
    const isCurrentlyCompleted = task?.data?.completed || false;
    
    // Toggle the completion status
    const response = await apperClient.updateRecord(TASK_TABLE, {
      Id: taskId,
      completed: !isCurrentlyCompleted
    });
    
    return response?.data;
  } catch (error) {
    console.error(`Error toggling task completion for ${taskId}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    await apperClient.deleteRecord(TASK_TABLE, taskId);
    return true;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};