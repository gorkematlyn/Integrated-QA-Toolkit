#!/usr/bin/env python3
"""
Test Scenario Generator - CSV Parser
Parses CSV files containing test scenarios and generates test code
"""

import os
import sys
import csv
import json
import logging
import tempfile
from io import StringIO
from pathlib import Path
from jinja2 import Template

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('test-generator')

class TestScenarioGenerator:
    """
    Generates test scripts from CSV input using templates
    """
    
    def __init__(self):
        self.logger = logger
        self.templates = {
            'selenium': self._get_selenium_template(),
            'pytest': self._get_pytest_template()
        }
    
    def generate_from_csv(self, csv_content, options=None):
        """
        Parse CSV content and generate test code using templates
        
        Args:
            csv_content: String containing CSV data
            options: Dict with generation options
                - framework: 'selenium' or 'pytest'
                - variables: Dict of variables to substitute
        
        Returns:
            Dict with generated code and metadata
        """
        if options is None:
            options = {}
        
        framework = options.get('framework', 'selenium')
        variables = options.get('variables', {})
        
        self.logger.info(f"Generating test scenarios using {framework} framework")
        
        try:
            # Parse CSV content
            csv_file = StringIO(csv_content)
            reader = csv.DictReader(csv_file)
            scenarios = list(reader)
            
            # Perform variable substitution
            for scenario in scenarios:
                for key, value in scenario.items():
                    for var_name, var_value in variables.items():
                        placeholder = f"${{{var_name}}}"
                        if placeholder in value:
                            scenario[key] = value.replace(placeholder, var_value)
            
            # Choose template based on framework
            if framework in self.templates:
                template = self.templates[framework]
            else:
                self.logger.warning(f"Unknown framework '{framework}', falling back to selenium")
                template = self.templates['selenium']
            
            # Generate code using template
            generated_code = template.render(
                scenarios=scenarios,
                test_name=options.get('test_name', 'GeneratedTest'),
                base_url=options.get('base_url', 'https://example.com')
            )
            
            return {
                'success': True,
                'code': generated_code,
                'framework': framework,
                'scenario_count': len(scenarios)
            }
            
        except Exception as e:
            self.logger.error(f"Error generating test scenarios: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _get_selenium_template(self):
        """
        Returns the Jinja2 template for Selenium tests
        """
        template_str = """
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class {{ test_name }}(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.base_url = "{{ base_url }}"
        
    def test_user_flow(self):
        driver = self.driver
        wait = WebDriverWait(driver, 10)
        
        # Navigate to site
        driver.get(self.base_url)
        
        {% for scenario in scenarios %}
        # Step {{ loop.index }}: {{ scenario.description }}
        {% if scenario.action == 'click' %}
        element = wait.until(EC.element_to_be_clickable((By.{{ scenario.selector_type }}, "{{ scenario.selector }}")))
        element.click()
        {% elif scenario.action == 'input' %}
        element = wait.until(EC.visibility_of_element_located((By.{{ scenario.selector_type }}, "{{ scenario.selector }}")))
        element.clear()
        element.send_keys("{{ scenario.value }}")
        {% elif scenario.action == 'assert' %}
        element = wait.until(EC.visibility_of_element_located((By.{{ scenario.selector_type }}, "{{ scenario.selector }}")))
        self.assertTrue("{{ scenario.expected_value }}" in element.text)
        {% elif scenario.action == 'wait' %}
        import time
        time.sleep({{ scenario.value }})
        {% endif %}
        {% endfor %}
        
    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
        """
        return Template(template_str)
    
    def _get_pytest_template(self):
        """
        Returns the Jinja2 template for Pytest with Playwright tests
        """
        template_str = """
import pytest
from playwright.sync_api import Page, expect

# Base URL for tests
BASE_URL = "{{ base_url }}"

def test_{{ test_name|lower }}(page: Page):
    # Navigate to site
    page.goto(BASE_URL)
    
    {% for scenario in scenarios %}
    # Step {{ loop.index }}: {{ scenario.description }}
    {% if scenario.action == 'click' %}
    page.click("{{ scenario.selector }}")
    {% elif scenario.action == 'input' %}
    page.fill("{{ scenario.selector }}", "{{ scenario.value }}")
    {% elif scenario.action == 'assert' %}
    element = page.locator("{{ scenario.selector }}")
    expect(element).to_contain_text("{{ scenario.expected_value }}")
    {% elif scenario.action == 'wait' %}
    page.wait_for_timeout({{ scenario.value }} * 1000)
    {% endif %}
    {% endfor %}
        """
        return Template(template_str)


def main():
    """
    Test function for running the module directly
    """
    if len(sys.argv) != 2:
        print("Usage: python csv_parser.py <csv_file>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    
    try:
        with open(csv_file_path, 'r') as f:
            csv_content = f.read()
        
        generator = TestScenarioGenerator()
        result = generator.generate_from_csv(csv_content, {
            'framework': 'selenium',
            'test_name': 'UserFlowTest',
            'base_url': 'https://example.com',
            'variables': {
                'USERNAME': 'test_user',
                'PASSWORD': 'test_pass'
            }
        })
        
        if result['success']:
            print(result['code'])
        else:
            print(f"Error: {result['error']}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main() 