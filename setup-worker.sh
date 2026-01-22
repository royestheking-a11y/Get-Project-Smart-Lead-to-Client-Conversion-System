#!/bin/bash

# Quick Setup Script for Worker with Render Backend

echo "🔧 Worker Setup for Render Deployment"
echo "======================================"
echo ""

# Check if API_URL is set
if grep -q "^API_URL=" backend/.env; then
    echo "✅ API_URL is already set in backend/.env"
    grep "^API_URL=" backend/.env
else
    echo "❌ API_URL not found in backend/.env"
    echo ""
    echo "Please add this line to backend/.env:"
    echo "API_URL=https://your-backend-app.onrender.com/api"
    echo ""
    read -p "Enter your Render backend URL (e.g., https://myapp.onrender.com): " RENDER_URL
    
    if [ ! -z "$RENDER_URL" ]; then
        echo "API_URL=${RENDER_URL}/api" >> backend/.env
        echo "✅ Added API_URL to backend/.env"
    fi
fi

echo ""
echo "🚀 Starting worker..."
cd backend && node worker.js
