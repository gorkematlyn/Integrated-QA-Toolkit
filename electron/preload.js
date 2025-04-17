const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Accessibility Module
    runAccessibilityScan: (url) => ipcRenderer.invoke('accessibility-scan', url),
    
    // Test Scenario Generator Module
    generateTestScenarios: (csvData, options) => 
      ipcRenderer.invoke('generate-test-scenarios', csvData, options),
    
    // Visual Regression Module
    compareImages: (baselineImage, testImage) => 
      ipcRenderer.invoke('compare-images', baselineImage, testImage),
    
    // Network Traffic Analyzer Module
    startNetworkCapture: () => ipcRenderer.invoke('start-network-capture'),
    stopNetworkCapture: () => ipcRenderer.invoke('stop-network-capture'),
    
    // App settings
    getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
    saveAppSettings: (settings) => ipcRenderer.invoke('save-app-settings', settings)
  }
); 