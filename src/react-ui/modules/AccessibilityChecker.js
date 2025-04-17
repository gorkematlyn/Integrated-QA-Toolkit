import React, { useState } from 'react';
import { FiGlobe, FiRefreshCw, FiCheck, FiAlertTriangle, FiInfo, FiDownload } from 'react-icons/fi';

const AccessibilityChecker = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) return;
    
    setIsScanning(true);
    setResults(null);
    
    try {
      // In a real implementation, this would call the Electron IPC API
      // For demo, we'll simulate a response after a delay
      setTimeout(() => {
        // Mock response for demo purposes
        setResults({
          url: url,
          scannedAt: new Date().toISOString(),
          violations: [
            {
              id: 'image-alt',
              impact: 'critical',
              description: 'Images must have alternate text',
              elements: 3,
            },
            {
              id: 'color-contrast',
              impact: 'serious',
              description: 'Elements must have sufficient color contrast',
              elements: 5,
            }
          ],
          passes: 15,
          incomplete: 2
        });
        
        setIsScanning(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error scanning URL:', error);
      setIsScanning(false);
    }
  };
  
  const handleReset = () => {
    setUrl('');
    setResults(null);
  };
  
  // Helper function to get impact badge color
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'serious':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'minor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const exportToPDF = () => {
    setIsExporting(true);
    
    // Simulate PDF export
    setTimeout(() => {
      // Create a simple text representation of the results
      const content = `
      Accessibility Report for ${results.url}
      Generated: ${new Date(results.scannedAt).toLocaleString()}
      
      Summary:
      - Issues Found: ${results.violations.length}
      - Tests Passed: ${results.passes}
      - Need Review: ${results.incomplete}
      
      Violations:
      ${results.violations.map(v => 
        `- ${v.description} (${v.impact}) - Affects ${v.elements} elements`
      ).join('\n')}
      `;
      
      // Create a blob and trigger download
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1000);
  };
  
  const exportToHTML = () => {
    setIsExporting(true);
    
    // Simulate HTML export
    setTimeout(() => {
      // Create a simple HTML representation of the results
      const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Accessibility Report for ${results.url}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4285F4; }
          .summary { display: flex; gap: 20px; }
          .summary-card { flex: 1; padding: 15px; border-radius: 8px; }
          .issues { background-color: #EBF5FF; }
          .passes { background-color: #F0FFF4; }
          .review { background-color: #FFFBEB; }
          .violation { margin-bottom: 15px; border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; }
          .critical { border-left: 4px solid #EF4444; }
          .serious { border-left: 4px solid #F97316; }
        </style>
      </head>
      <body>
        <h1>Accessibility Report</h1>
        <p>URL: ${results.url}</p>
        <p>Generated: ${new Date(results.scannedAt).toLocaleString()}</p>
        
        <h2>Summary</h2>
        <div class="summary">
          <div class="summary-card issues">
            <h3>Issues Found</h3>
            <p>${results.violations.length}</p>
          </div>
          <div class="summary-card passes">
            <h3>Tests Passed</h3>
            <p>${results.passes}</p>
          </div>
          <div class="summary-card review">
            <h3>Need Review</h3>
            <p>${results.incomplete}</p>
          </div>
        </div>
        
        <h2>Violations</h2>
        ${results.violations.map(v => `
          <div class="violation ${v.impact}">
            <h4>${v.description}</h4>
            <p>Impact: ${v.impact}</p>
            <p>Affects ${v.elements} elements</p>
          </div>
        `).join('')}
      </body>
      </html>
      `;
      
      // Create a blob and trigger download
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Accessibility Checker
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Scan websites for WCAG 2.1 compliance issues and generate detailed reports
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <label 
            htmlFor="url-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Website URL to Scan
          </label>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiGlobe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="url-input"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="input pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isScanning || !url}
                className="btn-primary flex items-center justify-center min-w-[120px]"
              >
                {isScanning ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 mr-2" />
                    Start Scan
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={handleReset} 
                disabled={isScanning}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiInfo className="mr-2 text-primary" /> 
            Scan Results for {results.url}
          </h2>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Scanned at: {new Date(results.scannedAt).toLocaleString()}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Issues Found</h3>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                {results.violations.length}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Tests Passed</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                {results.passes}
              </p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Need Review</h3>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
                {results.incomplete}
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiAlertTriangle className="mr-2 text-error" /> 
            Violations
          </h3>
          
          <div className="space-y-4 mb-6">
            {results.violations.map(violation => (
              <div 
                key={violation.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {violation.description}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(violation.impact)}`}>
                    {violation.impact}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Affects {violation.elements} elements
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              className="btn-primary flex items-center"
              onClick={exportToPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FiDownload className="w-4 h-4 mr-2" />
                  Export PDF
                </>
              )}
            </button>
            <button 
              className="btn-secondary flex items-center"
              onClick={exportToHTML}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FiDownload className="w-4 h-4 mr-2" />
                  Export HTML
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityChecker; 