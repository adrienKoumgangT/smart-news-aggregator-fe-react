#!/bin/bash

set -e

echo "Switching to project directory..."
cd "$(dirname "$0")"

echo "Installing dependencies (if not installed)..."
npm install

echo "Starting Vite dev server on port 5173..."
HOST=0.0.0.0 npm run dev