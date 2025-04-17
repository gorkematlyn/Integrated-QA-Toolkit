#!/usr/bin/env python3
"""
Script to install Python dependencies with the --break-system-packages flag.
Use at your own risk - this may affect system Python installation.
"""

import os
import sys
import subprocess
import time

def install_package(package_name):
    """Install a Python package with the --break-system-packages flag."""
    print(f"Installing {package_name}...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", 
            "--break-system-packages", package_name
        ])
        return True
    except subprocess.CalledProcessError:
        print(f"Error installing {package_name}")
        return False

def main():
    """Main function to install all required packages."""
    print("Installing Python dependencies...")
    print("WARNING: Using --break-system-packages flag which may affect system Python installation")
    print("Press Ctrl+C to cancel or wait 5 seconds to continue...")
    try:
        time.sleep(5)
    except KeyboardInterrupt:
        print("\nInstallation cancelled.")
        return
    
    # Define all required packages
    packages = [
        # Core dependencies
        "grpcio==1.59.0",
        "grpcio-tools==1.59.0",
        "jinja2==3.1.2",
        "protobuf==4.24.4",
        
        # Test Scenario Generator
        "pandas==2.1.0",
        
        # Visual Regression Tool
        "opencv-python==4.8.0.76",
        "numpy==1.25.2",
        "pillow==10.0.0",
        
        # Network Traffic Analyzer
        "mitmproxy==10.0.0",
        "pyOpenSSL==23.2.0"
    ]
    
    # Install each package
    failed_packages = []
    for package in packages:
        if not install_package(package):
            failed_packages.append(package)
    
    # Print summary
    if failed_packages:
        print("\nThe following packages failed to install:")
        for package in failed_packages:
            print(f"  - {package}")
        print("\nPlease try installing them manually.")
        return 1
    else:
        print("\nAll Python dependencies installed successfully!")
        return 0

if __name__ == "__main__":
    sys.exit(main()) 