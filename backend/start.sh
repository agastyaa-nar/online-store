#!/bin/bash

# Railway Startup Script
echo "🚀 Starting Online Store Backend..."

# Debug environment variables
echo "🔍 Environment Debug:"
echo "PORT env: $PORT"
echo "All env vars containing PORT:"
env | grep -i port || echo "No PORT variables found"

# Check if PORT environment variable is set
if [ -z "$PORT" ]; then
    echo "❌ PORT environment variable not set, using fallback 3000"
    PORT=3000
fi

echo "📡 Starting PHP server on port $PORT"

# Start PHP development server
exec php -S 0.0.0.0:$PORT
