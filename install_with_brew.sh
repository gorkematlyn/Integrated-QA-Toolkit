#!/bin/bash

# Script to install Python dependencies using Homebrew where possible
# This is a safer alternative to using --break-system-packages

echo "Checking if Homebrew is installed..."
if ! command -v brew &> /dev/null; then
    echo "Homebrew is not installed. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

echo "Installing Python dependencies with Homebrew..."

# Core dependencies
brew install python@3.11
brew install protobuf

# Install pip packages with pipx
echo "Installing pipx for isolated package installation..."
brew install pipx
pipx ensurepath

# Install packages using pipx
echo "Installing Python packages with pipx..."
pipx install grpcio==1.59.0
pipx install jinja2==3.1.2
pipx install pandas==2.1.0
pipx install opencv-python==4.8.0.76
pipx install numpy==1.25.2
pipx install pillow==10.0.0
pipx install mitmproxy==10.0.0
pipx install pyopenssl==23.2.0

echo "Python dependencies installed successfully with Homebrew and pipx!"
echo "These installations are isolated and will not affect your system Python." 