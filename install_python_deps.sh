#!/bin/bash

# Script to install Python dependencies with the --break-system-packages flag
# Use at your own risk - this may affect system Python installation

echo "Installing Python dependencies..."
echo "WARNING: Using --break-system-packages flag which may affect system Python installation"
echo "Press Ctrl+C to cancel or wait 5 seconds to continue..."
sleep 5

# Core dependencies
python3 -m pip install --break-system-packages grpcio==1.59.0
python3 -m pip install --break-system-packages grpcio-tools==1.59.0
python3 -m pip install --break-system-packages jinja2==3.1.2
python3 -m pip install --break-system-packages protobuf==4.24.4

# Test Scenario Generator
python3 -m pip install --break-system-packages pandas==2.1.0

# Visual Regression Tool
python3 -m pip install --break-system-packages opencv-python==4.8.0.76
python3 -m pip install --break-system-packages numpy==1.25.2
python3 -m pip install --break-system-packages pillow==10.0.0

# Network Traffic Analyzer
python3 -m pip install --break-system-packages mitmproxy==10.0.0
python3 -m pip install --break-system-packages pyOpenSSL==23.2.0

echo "Python dependencies installed successfully!" 