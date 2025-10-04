#!/bin/bash

# Railway Startup Script
echo "🚀 Starting Online Store Backend..."

# Check if PORT environment variable is set
if [ -z "$PORT" ]; then
    echo "❌ PORT environment variable not set"
    exit 1
fi

echo "📡 Starting PHP server on port $PORT"

# Start PHP development server
exec php -S 0.0.0.0:$PORT
