import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import { createTask, updateTask, deleteTask, toggleTaskCompletion } from '../services/taskService';

const PlusIcon = getIcon('PlusCircle');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');
const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const AlertCircleIcon = getIcon('AlertCircle');
const CalendarIcon = getIcon('Calendar');
const FlagIcon = getIcon('Flag');

const MainFeature = ({ tasks, isLoading, onTaskChange }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector(state => state.user.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setSubmitting(true);
    
    try {
      const taskData = {
        title,
        description,
        dueDate: dueDate || null,
        priority,
        completed: false,
      };
      
      if (isEditing) {
        await updateTask(editingTaskId, taskData);
        setIsEditing(false);
        setEditingTaskId(null);
        toast.success('Task updated successfully!');
      } else {
        await createTask(taskData);
        toast.success('Task added successfully!');
      }

      // Refresh tasks
      onTaskChange();
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    } catch (error) {
      toast.error(isEditing 
        ? 'Failed to update task. Please try again.' 
        : 'Failed to add task. Please try again.');
      console.error('Task operation failed:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const startEditing = (task) => {
    setIsEditing(true);
    setEditingTaskId(task.Id);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate || '');
    setPriority(task.priority || 'medium');
  };
  
  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  const handleToggleStatus = async (taskId) => {
    try {
      await toggleTaskCompletion(taskId);
      onTaskChange();
    } catch (error) {
      toast.error('Failed to update task status. Please try again.');
      console.error('Toggle status failed:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully!');
        onTaskChange();
      } catch (error) {
        toast.error('Failed to delete task. Please try again.');
        console.error('Delete task failed:', error);
      }
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };
  
  const getPriorityBg = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/20';
      case 'low': return 'bg-green-100 dark:bg-green-900/20';
      default: return 'bg-blue-100 dark:bg-blue-900/20';
    }
  };

  if (isLoading) {
    return <LoadingTasksSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8 neu-morphism"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Task Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Enter task title..."
            />
            {submitting && <div className="absolute right-3 top-8 animate-spin h-4 w-4 border-t-2 border-primary rounded-full"></div>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input min-h-[80px]"
              placeholder="Enter task details..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEditing}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`btn btn-primary ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center">
                  <span className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {isEditing ? 'Updating...' : 'Adding...'}
                </span>
              ) : isEditing ? (
                <>
                  <CheckIcon className="w-5 h-5 mr-1" />
                  Update Task
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-1" />
                  Add Task
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
      
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          {tasks.length === 0 ? 'No tasks yet' : 'Your Tasks'}
        </h2>

        
        <AnimatePresence>
          {tasks?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <AlertCircleIcon className="w-16 h-16 text-surface-400 mx-auto mb-4" />
              <p className="text-surface-500 dark:text-surface-400">
                You don't have any tasks yet. Add a new task to get started.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="space-y-3"
            >
              {tasks.map((task) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                  className={`bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 
                  ${task.completed 
                    ? 'border-secondary dark:border-secondary-dark' 
                    : 'border-' + getPriorityColor(task.priority).split('-')[0] + '-500'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <button
                      onClick={() => handleToggleStatus(task.Id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center ${
                        task.completed 
                          ? 'bg-secondary border-secondary' 
                          : 'border-surface-300 dark:border-surface-600'
                      }`}
                    >
                      {task.completed && (
                        <CheckIcon className="w-6 h-6 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-grow">
                      <h3 className={`text-lg font-medium ${
                        task.completed ? 'line-through text-surface-400' : ''
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`text-sm text-surface-600 dark:text-surface-400 mt-1 ${
                          task.completed ? 'line-through text-surface-400' : ''
                        }`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.dueDate && (
                          <span className="inline-flex items-center text-xs bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 px-2 py-1 rounded-md">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        
                        <span className={`inline-flex items-center text-xs ${getPriorityBg(task.priority)} ${getPriorityColor(task.priority)} px-2 py-1 rounded-md`}>
                          <FlagIcon className="w-3 h-3 mr-1" />
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 md:self-start">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 text-surface-500 hover:text-primary transition-colors duration-200"
                        aria-label="Edit task"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTask(task.Id)}
                        className="p-2 text-surface-500 hover:text-accent transition-colors duration-200"
                        aria-label="Delete task"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Loading skeleton component
const LoadingTasksSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8 animate-pulse">
        <div className="h-12 bg-surface-200 dark:bg-surface-700 rounded-lg mb-4"></div>
        <div className="h-24 bg-surface-200 dark:bg-surface-700 rounded-lg mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="h-12 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
          <div className="h-12 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
        </div>
        <div className="flex justify-end">
          <div className="h-10 w-32 bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
        </div>
      </div>
      <div className="h-8 w-48 bg-surface-200 dark:bg-surface-700 rounded-lg mb-4"></div>
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-surface-200 dark:bg-surface-700 rounded-lg mb-3 animate-pulse"></div>
      ))}
    </div>
  );
};

export default MainFeature;