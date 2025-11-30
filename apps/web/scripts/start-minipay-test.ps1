# PowerShell script to start Next.js dev server and ngrok tunnel for MiniPay testing
# Usage: .\scripts\start-minipay-test.ps1

Write-Host "🚀 Starting Color Match Rush for MiniPay testing..." -ForegroundColor Cyan
Write-Host ""

# Check if ngrok is installed
try {
    $ngrokVersion = ngrok version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "ngrok not found"
    }
} catch {
    Write-Host "❌ ngrok is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   Visit: https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "   Or install via: choco install ngrok (Windows with Chocolatey)" -ForegroundColor Yellow
    Write-Host "   Or install via: npm install -g ngrok" -ForegroundColor Yellow
    exit 1
}

# Check if port 3000 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Port 3000 is already in use. Please stop the process using it first." -ForegroundColor Yellow
    exit 1
}

# Get script directory and navigate to web app root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$webAppRoot = Split-Path -Parent $scriptDir
Set-Location $webAppRoot

# Start Next.js dev server in background
Write-Host "📦 Starting Next.js dev server on port 3000..." -ForegroundColor Cyan
$devJob = Start-Job -ScriptBlock {
    Set-Location $using:webAppRoot
    pnpm dev
}

# Wait for dev server to start
Write-Host "⏳ Waiting for dev server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if dev server started successfully
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Dev server is running on http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Dev server failed to start. Please check for errors above." -ForegroundColor Red
    Stop-Job $devJob
    Remove-Job $devJob
    exit 1
}

Write-Host ""

# Start ngrok tunnel
Write-Host "🌐 Starting ngrok tunnel..." -ForegroundColor Cyan
$ngrokJob = Start-Job -ScriptBlock {
    Set-Location $using:webAppRoot
    ngrok start --config=ngrok.yml minipay
}

# Wait for ngrok to start
Start-Sleep -Seconds 3

# Get ngrok URL
try {
    $tunnels = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $ngrokUrl = $tunnels.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1 -ExpandProperty public_url
    
    if ($ngrokUrl) {
        Write-Host "✅ Ngrok tunnel is active!" -ForegroundColor Green
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host "🎯 MiniPay Testing URL:" -ForegroundColor Yellow
        Write-Host "   $ngrokUrl" -ForegroundColor White
        Write-Host ""
        Write-Host "📱 To test in MiniPay:" -ForegroundColor Yellow
        Write-Host "   1. Open MiniPay app on your device" -ForegroundColor White
        Write-Host "   2. Go to Settings → Developer Settings" -ForegroundColor White
        Write-Host "   3. Tap 'Load test page'" -ForegroundColor White
        Write-Host "   4. Enter: $ngrokUrl" -ForegroundColor White
        Write-Host "   5. Tap 'Load' to launch your Mini App" -ForegroundColor White
        Write-Host ""
        Write-Host "🌐 Ngrok Dashboard: http://localhost:4040" -ForegroundColor Cyan
        Write-Host "💻 Local Dev Server: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "⚠️  Could not retrieve ngrok URL. Please check ngrok dashboard at http://localhost:4040" -ForegroundColor Yellow
        Write-Host "   You can manually get the URL from the ngrok web interface." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not retrieve ngrok URL. Please check ngrok dashboard at http://localhost:4040" -ForegroundColor Yellow
    Write-Host "   You can manually get the URL from the ngrok web interface." -ForegroundColor Yellow
}

Write-Host "Press Ctrl+C to stop both servers..." -ForegroundColor Yellow
Write-Host ""

# Cleanup function
function Cleanup {
    Write-Host ""
    Write-Host "🛑 Shutting down..." -ForegroundColor Yellow
    Stop-Job $devJob -ErrorAction SilentlyContinue
    Stop-Job $ngrokJob -ErrorAction SilentlyContinue
    Remove-Job $devJob -ErrorAction SilentlyContinue
    Remove-Job $ngrokJob -ErrorAction SilentlyContinue
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
    exit 0
}

# Register cleanup on exit
Register-EngineEvent PowerShell.Exiting -Action { Cleanup } | Out-Null

# Wait for Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Cleanup
}

