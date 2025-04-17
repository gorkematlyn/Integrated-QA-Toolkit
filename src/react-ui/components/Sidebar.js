import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiEye, 
  FiCode, 
  FiImage, 
  FiActivity, 
  FiMoon, 
  FiSun 
} from 'react-icons/fi';

const Sidebar = ({ toggleTheme, isDarkMode }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/accessibility', label: 'Accessibility Checker', icon: <FiEye className="w-5 h-5" /> },
    { path: '/test-generator', label: 'Test Scenario Generator', icon: <FiCode className="w-5 h-5" /> },
    { path: '/visual-regression', label: 'Visual Regression Tool', icon: <FiImage className="w-5 h-5" /> },
    { path: '/network-analyzer', label: 'Network Traffic Analyzer', icon: <FiActivity className="w-5 h-5" /> },
  ];
  
  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">QA Toolkit</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 mb-1 rounded-md transition-colors
                        ${location.pathname === item.path 
                          ? 'bg-primary/10 text-primary dark:text-primary border-l-4 border-primary'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md
                     bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <span className="flex items-center">
            {isDarkMode ? <FiSun className="w-4 h-4 mr-2" /> : <FiMoon className="w-4 h-4 mr-2" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
          <span className="text-xs font-normal px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
            {isDarkMode ? 'On' : 'Off'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 