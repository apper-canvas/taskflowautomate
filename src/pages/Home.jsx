import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const CheckCircleIcon = getIcon('CheckCircle');
const ClipboardListIcon = getIcon('ClipboardList');

const Home = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };
  
  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    const taskName = tasks.find(task => task.id === id).title;
    const newStatus = !tasks.find(task => task.id === id).completed;
    toast.info(`Task "${taskName}" marked as ${newStatus ? 'completed' : 'incomplete'}`);
  };
  
  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    toast.success(`Task "${taskToDelete.title}" deleted`);
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="mt-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
          TaskFlow
        </h1>
        <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
          Organize your tasks efficiently and boost your productivity
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <ClipboardListIcon className="w-8 h-8 text-primary mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Total Tasks</h3>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-accent mr-3">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-secondary mr-3" />
            <div>
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button 
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Completed
        </button>
      </div>
      
      <MainFeature 
        tasks={filteredTasks}
        onAddTask={addTask}
        onToggleStatus={toggleTaskStatus}
        onDeleteTask={deleteTask}
      />
    </div>
  );
};

export default Home;