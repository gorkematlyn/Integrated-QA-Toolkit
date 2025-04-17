import React, { useState } from 'react';
import { FiUpload, FiCode, FiDownload, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

const TestScenarioGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testFramework, setTestFramework] = useState('selenium');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };
  
  const handleGenerate = async () => {
    if (!selectedFile) return;
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call the Electron IPC API
      // For demo, we'll simulate a response after a delay
      setTimeout(() => {
        // Mock response with code generation based on selected framework
        if (testFramework === 'selenium') {
          setGeneratedCode(`
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By

class TestUserFlow(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        
    def test_login_flow(self):
        driver = self.driver
        
        # Navigate to site
        driver.get("https://example.com")
        
        # Login step
        driver.find_element(By.ID, "username").send_keys("test_user")
        driver.find_element(By.ID, "password").send_keys("test_pass")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Assert successful login
        welcome_element = driver.find_element(By.CSS_SELECTOR, ".welcome-message")
        self.assertTrue("Welcome" in welcome_element.text)
        
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
          `);
        } else if (testFramework === 'pytest') {
          setGeneratedCode(`
import pytest
from playwright.sync_api import Page, expect

def test_login_flow(page: Page):
    # Navigate to site
    page.goto("https://example.com")
    
    # Login step
    page.fill("#username", "test_user")
    page.fill("#password", "test_pass")
    page.click("button[type='submit']")
    
    # Assert successful login
    welcome_element = page.locator(".welcome-message")
    expect(welcome_element).to_contain_text("Welcome")
          `);
        } else if (testFramework === 'cypress') {
          setGeneratedCode(`
describe('User Authentication', () => {
  it('should login successfully', () => {
    // Navigate to the site
    cy.visit('https://example.com')
    
    // Login step
    cy.get('#username').type('test_user')
    cy.get('#password').type('test_pass')
    cy.get('button[type="submit"]').click()
    
    // Assert successful login
    cy.get('.welcome-message')
      .should('be.visible')
      .and('contain', 'Welcome')
      
    // Additional checks
    cy.url().should('include', '/dashboard')
    cy.getCookie('auth_token').should('exist')
  })
  
  it('should display error with invalid credentials', () => {
    // Navigate to the site
    cy.visit('https://example.com')
    
    // Try invalid login
    cy.get('#username').type('invalid_user')
    cy.get('#password').type('wrong_password')
    cy.get('button[type="submit"]').click()
    
    // Assert error message
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Invalid credentials')
      
    // URL should not change
    cy.url().should('not.include', '/dashboard')
  })
})
          `);
        } else if (testFramework === 'robot') {
          setGeneratedCode(`
*** Settings ***
Library    SeleniumLibrary
Suite Setup    Open Browser    about:blank    chrome
Suite Teardown    Close All Browsers

*** Variables ***
\${BASE_URL}    https://example.com
\${USERNAME}    test_user
\${PASSWORD}    test_pass

*** Test Cases ***
Valid Login Test
    Navigate To Login Page
    Enter Username    \${USERNAME}
    Enter Password    \${PASSWORD}
    Submit Login Form
    Verify Successful Login

Invalid Login Test
    Navigate To Login Page
    Enter Username    invalid_user
    Enter Password    wrong_password
    Submit Login Form
    Verify Failed Login

*** Keywords ***
Navigate To Login Page
    Go To    \${BASE_URL}
    Wait Until Element Is Visible    id=username

Enter Username
    [Arguments]    \${username}
    Input Text    id=username    \${username}

Enter Password
    [Arguments]    \${password}
    Input Password    id=password    \${password}

Submit Login Form
    Click Button    css=button[type="submit"]

Verify Successful Login
    Wait Until Element Is Visible    css=.welcome-message
    Element Should Contain    css=.welcome-message    Welcome
    Location Should Contain    /dashboard

Verify Failed Login
    Element Should Be Visible    css=.error-message
    Element Should Contain    css=.error-message    Invalid credentials
          `);
        }
        
        setIsGenerating(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating test scenario:', error);
      setIsGenerating(false);
    }
  };
  
  const handleReset = () => {
    setSelectedFile(null);
    setGeneratedCode('');
  };
  
  const downloadCode = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      // Get appropriate file extension based on framework
      let extension = '.py';
      let filename = 'test_user_flow';
      
      if (testFramework === 'cypress') {
        extension = '.js';
        filename = 'login_spec';
      } else if (testFramework === 'robot') {
        extension = '.robot';
        filename = 'login_tests';
      }
      
      // Create blob and trigger download
      const blob = new Blob([generatedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 800);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Test Scenario Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Convert user flows from CSV files into test automation scripts
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Flow CSV</h2>
        
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary/20 transition-all"
          onClick={() => document.getElementById('csv-file-input').click()}
        >
          <input 
            id="csv-file-input" 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center">
            <FiUpload className="w-10 h-10 text-gray-400 mb-4" />
            
            {selectedFile ? (
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">Selected file: {selectedFile.name}</p>
                <p className="text-gray-500 dark:text-gray-400">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">Drag & drop a CSV file here, or click to browse</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  The CSV should contain columns for steps, actions, and expected results
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="framework-select">
            Test Framework
          </label>
          <select 
            id="framework-select"
            value={testFramework}
            onChange={(e) => setTestFramework(e.target.value)}
            className="input"
          >
            <option value="selenium">Selenium (Python)</option>
            <option value="pytest">Pytest with Playwright</option>
            <option value="cypress">Cypress (JavaScript)</option>
            <option value="robot">Robot Framework</option>
          </select>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6">
          <button 
            onClick={handleGenerate}
            disabled={!selectedFile || isGenerating}
            className="btn-primary flex items-center"
          >
            {isGenerating ? (
              <>
                <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FiCode className="w-4 h-4 mr-2" />
                Generate Test Code
              </>
            )}
          </button>
          
          <button 
            onClick={handleReset}
            disabled={!selectedFile && !generatedCode}
            className="btn-secondary flex items-center"
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>
      
      {generatedCode && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Test Code</h2>
            <button 
              className="btn-secondary flex items-center text-sm py-1"
              onClick={downloadCode}
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
                  Download Code
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <pre className="text-gray-100 p-4 overflow-x-auto">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestScenarioGenerator; 