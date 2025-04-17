import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiEye, 
  FiCode, 
  FiImage, 
  FiActivity, 
  FiArrowRight 
} from 'react-icons/fi';

const Dashboard = () => {
  const modules = [
    {
      id: 'accessibility',
      title: 'Accessibility Checker',
      description: 'Scan websites for WCAG 2.1 compliance issues and receive detailed reports.',
      icon: <FiEye className="w-10 h-10 text-primary" />,
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'test-generator',
      title: 'Test Scenario Generator',
      description: 'Convert user flows from CSV files into Selenium or Pytest test scripts.',
      icon: <FiCode className="w-10 h-10 text-secondary" />,
      color: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'visual-regression',
      title: 'Visual Regression Tool',
      description: 'Compare screenshots and identify visual differences between versions.',
      icon: <FiImage className="w-10 h-10 text-accent" />,
      color: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      id: 'network-analyzer',
      title: 'Network Traffic Analyzer',
      description: 'Capture and analyze API requests/responses to identify performance issues.',
      icon: <FiActivity className="w-10 h-10 text-error" />,
      color: 'bg-red-50 dark:bg-red-900/20'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to the Integrated QA Toolkit
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          An all-in-one solution for quality assurance professionals, combining essential
          tools to streamline your testing workflow. Select a module below to get started.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {modules.map(module => (
          <Link
            key={module.id}
            to={`/${module.id}`}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 
                     hover:shadow-card-hover transition-all duration-300 
                     border border-transparent hover:border-primary/20 
                     flex flex-col h-full"
          >
            <div className={`p-4 rounded-lg ${module.color} mb-4 self-start`}>
              {module.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {module.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
              {module.description}
            </p>
            <div className="text-primary flex items-center mt-2 group-hover:translate-x-1 transition-transform">
              <span className="mr-2 font-medium">Open Tool</span>
              <FiArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 