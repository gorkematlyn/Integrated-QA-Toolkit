import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // BrowserRouter'ı HashRouter olarak değiştir
import Sidebar from './react-ui/components/Sidebar';
import Dashboard from './react-ui/components/Dashboard';
import AccessibilityChecker from './react-ui/modules/AccessibilityChecker';
import TestScenarioGenerator from './react-ui/modules/TestScenarioGenerator';
import VisualRegressionTool from './react-ui/modules/VisualRegressionTool';
import NetworkTrafficAnalyzer from './react-ui/modules/NetworkTrafficAnalyzer';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for user preferred color scheme on first load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);
  
  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Dashboard />} /> {/* index prop'unu kullan */}
            {/* <Route path="/" element={<Dashboard />} /> Bu satır artık gereksiz olabilir, ama şimdilik kalsın */}
            <Route path="/accessibility" element={<AccessibilityChecker />} />
            <Route path="/test-generator" element={<TestScenarioGenerator />} />
            <Route path="/visual-regression" element={<VisualRegressionTool />} />
            <Route path="/network-analyzer" element={<NetworkTrafficAnalyzer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
