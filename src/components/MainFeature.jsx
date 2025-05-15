import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const PlusIcon = getIcon('Plus');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');
const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const AlertCircleIcon = getIcon('AlertCircle');
const CalendarIcon = getIcon('Calendar');
const FlagIcon = getIcon('Flag');

const MainFeature = ({ tasks, onAddTask, onToggleStatus, onDeleteTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    const newTask = {
      id: isEditing ? editingTaskId : Date.now(),
      title,
      description,
      dueDate,
      priority,
      completed: false,
      createdAt: isEditing 
        ? tasks.find(task => task.id === editingTaskId).createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (isEditing) {
      onAddTask(tasks.map(task => 
        task.id === editingTaskId ? newTask : task
      ));
      setIsEditing(false);
      setEditingTaskId(null);
      toast.success('Task updated successfully!');
    } else {
      onAddTask(newTask);
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };
  
  const startEditing = (task) => {
    setIsEditing(true);
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate || '');
    setPriority(task.priority || 'medium');
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-amber-500';
    }
  };
  
  const getPriorityBg = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/20';
      case 'low': return 'bg-green-100 dark:bg-green-900/20';
      default: return 'bg-amber-100 dark:bg-amber-900/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8 neu-morphism"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
                onClick={cancelEditing}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? (
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
          {tasks.length === 0 ? (
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
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                  className={`bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 
                  ${task.completed 
                    ? 'border-secondary dark:border-secondary-dark' 
                    : `border-${getPriorityColor(task.priority).split('-')[0]}-500`}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border ${
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
                        onClick={() => onDeleteTask(task.id)}
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

export default MainFeature;