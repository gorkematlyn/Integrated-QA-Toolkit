import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiSquare, FiDownload, FiRefreshCw, FiGlobe, FiActivity, FiClock, FiAlertCircle, FiCheck, FiSettings, FiTrash2 } from 'react-icons/fi';

const NetworkTrafficAnalyzer = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStartTime, setCaptureStartTime] = useState(null);
  const [capturedRequests, setCapturedRequests] = useState([]);
  const [proxyUrl, setProxyUrl] = useState('http://localhost:8080');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const timerRef = useRef(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    avgResponseTime: 0,
    slowRequests: 0,
    errorRequests: 0
  });
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isCapturing) {
      // Generate random proxy URL on start
      const randomPort = Math.floor(Math.random() * 10000) + 8000;
      setProxyUrl(`http://localhost:${randomPort}`);
      simulateNetworkTraffic();
    } else {
      // Clear any pending timers when stopping capture
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isCapturing]);
  
  useEffect(() => {
    // Filter requests based on search query
    if (!searchQuery) {
      setFilteredRequests(capturedRequests);
    } else {
      const filtered = capturedRequests.filter(req => 
        req.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.method.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [searchQuery, capturedRequests]);
  
  const startCapture = async () => {
    setIsCapturing(true);
    setCaptureStartTime(new Date());
    setCapturedRequests([]);
    
    // In a real implementation, this would call the Electron IPC API
    // For demo, we'll simulate network traffic after a delay
  };
  
  const stopCapture = () => {
    setIsCapturing(false);
    calculateStats();
  };
  
  const updateProxyUrl = (e) => {
    setProxyUrl(e.target.value);
  };
  
  const clearAllData = () => {
    setCapturedRequests([]);
    setFilteredRequests([]);
    setStats({
      totalRequests: 0,
      avgResponseTime: 0,
      slowRequests: 0,
      errorRequests: 0
    });
  };
  
  const simulateNetworkTraffic = () => {
    // Simulate receiving network requests at random intervals
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const statusCodes = [200, 201, 301, 400, 404, 500];
    const paths = [
      '/api/users',
      '/api/products',
      '/api/orders',
      '/api/auth/login',
      '/api/settings'
    ];
    
    const generateRequest = () => {
      if (!isCapturing) return;
      
      const method = methods[Math.floor(Math.random() * methods.length)];
      const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      const path = paths[Math.floor(Math.random() * paths.length)];
      const responseTime = Math.floor(Math.random() * 5000); // 0-5000ms
      
      const newRequest = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        method,
        path,
        statusCode,
        responseTime,
        contentSize: Math.floor(Math.random() * 1000) + 'kb',
        type: 'application/json'
      };
      
      setCapturedRequests(prev => [newRequest, ...prev].slice(0, 100)); // Keep last 100 requests
      
      // Schedule next request
      const nextRequestDelay = Math.floor(Math.random() * 2000) + 500; // 500-2500ms
      timerRef.current = setTimeout(generateRequest, nextRequestDelay);
    };
    
    generateRequest();
  };
  
  const calculateStats = () => {
    const totalRequests = capturedRequests.length;
    let totalResponseTime = 0;
    let slowRequests = 0;
    let errorRequests = 0;
    
    capturedRequests.forEach(req => {
      totalResponseTime += req.responseTime;
      
      if (req.responseTime > 2000) {
        slowRequests++;
      }
      
      if (req.statusCode >= 400) {
        errorRequests++;
      }
    });
    
    setStats({
      totalRequests,
      avgResponseTime: totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) : 0,
      slowRequests,
      errorRequests
    });
  };
  
  const getStatusClass = (statusCode) => {
    if (statusCode < 300) return 'text-secondary dark:text-green-300';
    if (statusCode < 400) return 'text-accent dark:text-yellow-300';
    return 'text-error dark:text-red-300';
  };
  
  const exportToCSV = () => {
    if (capturedRequests.length === 0) return;
    
    // Simple CSV export
    const headers = ['Timestamp', 'Method', 'Path', 'Status', 'Response Time (ms)', 'Content Size'];
    
    const csvContent = [
      headers.join(','),
      ...capturedRequests.map(req => {
        return [
          new Date(req.timestamp).toLocaleString(),
          req.method,
          req.path,
          req.statusCode,
          req.responseTime,
          req.contentSize
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `network-traffic-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Network Traffic Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor and analyze network requests in real-time
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Capture Controls</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${isCapturing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} mr-2`}></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isCapturing ? 'Capturing...' : 'Idle'}
            </span>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <FiSettings className="text-blue-800 dark:text-blue-300 mr-2" />
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Proxy Configuration</h3>
          </div>
          
          <div className="font-mono text-xs bg-white dark:bg-gray-900 p-3 rounded border border-blue-100 dark:border-blue-900">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <label className="text-gray-700 dark:text-gray-300 text-sm font-medium min-w-[80px]">Proxy URL:</label>
              <input 
                type="text" 
                value={proxyUrl} 
                onChange={updateProxyUrl}
                disabled={isCapturing}
                className="input py-1 px-2 text-sm flex-grow"
                placeholder="http://localhost:8080"
              />
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
              Bu örnek uygulama gerçek bir proxy sunucu başlatmaz. Gerçek uygulamada, 
              backend'de mitmproxy çalıştırılır ve tarayıcınızın proxy ayarlarını 
              yukarıdaki URL'ye yönlendirmeniz gerekir.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {!isCapturing ? (
            <button 
              onClick={startCapture}
              className="btn-primary flex items-center"
            >
              <FiPlay className="w-4 h-4 mr-2" />
              Start Capture
            </button>
          ) : (
            <button 
              onClick={stopCapture}
              className="btn-secondary bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30 flex items-center"
            >
              <FiSquare className="w-4 h-4 mr-2" />
              Stop Capture
            </button>
          )}
          
          <button 
            onClick={exportToCSV}
            disabled={capturedRequests.length === 0}
            className="btn-secondary flex items-center"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export as CSV
          </button>
          
          <button 
            onClick={clearAllData}
            disabled={capturedRequests.length === 0}
            className="btn-secondary bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center"
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>
      
      {capturedRequests.length > 0 && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <FiActivity className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Requests</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <FiClock className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Response Time</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgResponseTime} ms</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <FiAlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Slow Requests</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.slowRequests}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <FiAlertCircle className="w-4 h-4 text-error mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Error Requests</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.errorRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Request Log</h2>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input py-1 pl-8 text-sm"
                />
                <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900 rounded-tl-lg">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                      Path
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900">
                      Response Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900 rounded-tr-lg">
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRequests.slice(0, 20).map(request => (
                    <tr 
                      key={request.id} 
                      className={request.responseTime > 2000 ? 'bg-red-50 dark:bg-red-900/10' : ''}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(request.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          request.method === 'GET' ? 'text-blue-600 dark:text-blue-400' :
                          request.method === 'POST' ? 'text-green-600 dark:text-green-400' :
                          request.method === 'PUT' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {request.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {request.path}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getStatusClass(request.statusCode)}`}>
                          {request.statusCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm ${
                            request.responseTime > 2000 ? 'text-red-600 dark:text-red-400 font-medium' : 
                            'text-gray-700 dark:text-gray-300'
                          }`}>
                            {request.responseTime} ms
                          </span>
                          {request.responseTime > 2000 && (
                            <FiAlertCircle className="ml-1 text-red-500 w-4 h-4" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {request.contentSize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No matching requests found</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {isCapturing && capturedRequests.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 text-center">
          <FiActivity className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
          <h3 className="text-gray-900 dark:text-white font-medium mb-2">Waiting for network traffic...</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Use your application with the configured proxy to see requests appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default NetworkTrafficAnalyzer;