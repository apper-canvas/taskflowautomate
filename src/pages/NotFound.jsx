import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const AlertCircleIcon = getIcon('AlertCircle');
const HomeIcon = getIcon('Home');

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="mb-8"
      >
        <AlertCircleIcon className="w-24 h-24 text-accent mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-surface-800 dark:text-surface-100 mb-2">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-surface-600 dark:text-surface-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>
      </motion.div>
      
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center mx-auto"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Go Home
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default NotFound;