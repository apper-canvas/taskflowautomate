import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

const AlertTriangleIcon = getIcon('AlertTriangle');

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <AlertTriangleIcon className="w-16 h-16 text-accent mb-6" />
      
      <h1 className="text-4xl font-bold mb-4 text-surface-800 dark:text-surface-100">
        Page Not Found
      </h1>
      
      <p className="text-lg text-surface-600 dark:text-surface-300 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;