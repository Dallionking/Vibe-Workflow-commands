#!/bin/bash
# Script to ensure Node.js v20 is being used for the multi-agent system

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js v20
nvm use 20

# Verify the version
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"