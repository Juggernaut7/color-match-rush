#!/bin/bash

# Script to start Next.js dev server and ngrok tunnel for MiniPay testing
# Usage: ./scripts/start-minipay-test.sh

set -e

echo "🚀 Starting Color Match Rush for MiniPay testing..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Please install it first:"
    echo "   Visit: https://ngrok.com/download"
    echo "   Or install via: brew install ngrok/ngrok/ngrok (macOS)"
    echo "   Or install via: npm install -g ngrok"
    exit 1
fi

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is already in use. Please stop the process using it first."
    exit 1
fi

# Start Next.js dev server in background
echo "📦 Starting Next.js dev server on port 3000..."
cd "$(dirname "$0")/.."
pnpm dev &
DEV_PID=$!

# Wait for dev server to start
echo "⏳ Waiting for dev server to start..."
sleep 5

# Check if dev server started successfully
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Dev server failed to start. Please check for errors above."
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Dev server is running on http://localhost:3000"
echo ""

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok start --config=ngrok.yml minipay &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  Could not retrieve ngrok URL. Please check ngrok dashboard at http://localhost:4040"
    echo "   You can manually get the URL from the ngrok web interface."
else
    echo "✅ Ngrok tunnel is active!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 MiniPay Testing URL:"
    echo "   $NGROK_URL"
    echo ""
    echo "📱 To test in MiniPay:"
    echo "   1. Open MiniPay app on your device"
    echo "   2. Go to Settings → Developer Settings"
    echo "   3. Tap 'Load test page'"
    echo "   4. Enter: $NGROK_URL"
    echo "   5. Tap 'Load' to launch your Mini App"
    echo ""
    echo "🌐 Ngrok Dashboard: http://localhost:4040"
    echo "💻 Local Dev Server: http://localhost:3000"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $DEV_PID 2>/dev/null || true
    kill $NGROK_PID 2>/dev/null || true
    echo "✅ Cleanup complete"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

echo "Press Ctrl+C to stop both servers..."
echo ""

# Wait for processes
wait

