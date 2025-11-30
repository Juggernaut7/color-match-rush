# MiniPay Testing Guide

This guide will help you test your Color Match Rush app in the MiniPay environment using ngrok.

## Prerequisites

1. **MiniPay App** installed on your device
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=com.minipay.app)
   - iOS: [App Store](https://apps.apple.com/app/minipay/id1234567890)

2. **ngrok** installed on your development machine
   - Download from: https://ngrok.com/download
   - Or install via package manager:
     ```bash
     # macOS
     brew install ngrok/ngrok/ngrok
     
     # npm (global)
     npm install -g ngrok
     ```

3. **Node.js and pnpm** installed (already set up in this project)

## Quick Start

### Option 1: Automated Script (Recommended)

1. Make the script executable:
   ```bash
   chmod +x apps/web/scripts/start-minipay-test.sh
   ```

2. Run the script:
   ```bash
   cd apps/web
   ./scripts/start-minipay-test.sh
   ```

The script will:
- Start the Next.js dev server on port 3000
- Start ngrok tunnel
- Display the public URL for MiniPay testing

### Option 2: Manual Setup

1. **Start the Next.js dev server:**
   ```bash
   cd apps/web
   pnpm dev
   ```
   The server will run on `http://localhost:3000`

2. **In a new terminal, start ngrok:**
   ```bash
   cd apps/web
   pnpm ngrok
   ```
   Or directly:
   ```bash
   ngrok start --config=apps/web/ngrok.yml minipay
   ```

3. **Get your public URL:**
   - Open http://localhost:4040 in your browser (ngrok dashboard)
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

## Testing in MiniPay

1. **Enable Developer Mode in MiniPay:**
   - Open MiniPay app on your device
   - Go to **Settings**
   - In the **About** section, tap the **Version** number repeatedly (about 7 times)
   - You'll see a confirmation message: "Developer Mode enabled"
   - Go back to **Settings** → **Developer Settings**
   - Enable **Developer Mode**
   - Toggle **Use Testnet** to connect to Celo Alfajores testnet

2. **Load Your Mini App:**
   - In **Developer Settings**, tap **Load test page**
   - Enter your ngrok URL (e.g., `https://abc123.ngrok-free.app`)
   - Tap **Load** to launch your app

3. **Test Your App:**
   - Connect your wallet (should auto-connect in MiniPay)
   - Test the game flow
   - Test wallet transactions (entry fees, etc.)
   - Verify all features work correctly

## Configuration Files

### `ngrok.yml`
Contains ngrok configuration with your auth token. The tunnel is configured to:
- Forward HTTP traffic to port 3000
- Use HTTPS (bind_tls: true)
- Enable inspection dashboard

### `public/manifest.json`
Web app manifest for MiniPay Mini App. Defines:
- App name and description
- Theme colors
- Icons
- Display mode

## Troubleshooting

### Port 3000 Already in Use
If you get an error that port 3000 is in use:
```bash
# Find the process using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### ngrok Not Starting
- Verify your auth token in `ngrok.yml` is correct
- Check if ngrok is installed: `ngrok version`
- Try running ngrok directly: `ngrok http 3000`

### MiniPay Can't Load the App
- Ensure ngrok tunnel is active (check http://localhost:4040)
- Verify the URL is HTTPS (not HTTP)
- Check that the dev server is running on port 3000
- Try refreshing the page in MiniPay

### Wallet Connection Issues
- Ensure MiniPay is set to testnet mode
- Check that your app detects MiniPay correctly
- Verify the wallet provider is configured for Celo Alfajores

### CORS Errors
The Next.js config includes CORS headers, but if you still see issues:
- Check browser console for specific errors
- Verify ngrok is forwarding correctly
- Ensure all API routes are accessible

## Network Configuration

### Allowed Hosts
The Next.js config allows requests from ngrok domains:
- `.ngrok.app`
- `.ngrok-free.dev`
- `.ngrok-free.app`

### Environment Variables
Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_TREASURY_ADDRESS=your_treasury_address
```

## Testing Checklist

- [ ] Dev server starts successfully
- [ ] ngrok tunnel is active
- [ ] Can access app via ngrok URL in browser
- [ ] MiniPay Developer Mode is enabled
- [ ] App loads in MiniPay
- [ ] Wallet auto-connects in MiniPay
- [ ] Game page loads correctly
- [ ] Can join a round (transaction works)
- [ ] Can play the game
- [ ] Score submission works
- [ ] Leaderboard displays correctly
- [ ] All navigation works

## Production Deployment

For production deployment to MiniPay:
1. Deploy your app to a hosting service (Vercel, Netlify, etc.)
2. Get your production URL
3. Submit your Mini App to MiniPay for review
4. Once approved, users can access it directly in MiniPay

## Resources

- [MiniPay Documentation](https://docs.minipay.xyz/)
- [MiniPay Testing Guide](https://docs.minipay.xyz/getting-started/test-in-minipay.html)
- [ngrok Documentation](https://ngrok.com/docs)
- [Celo Documentation](https://docs.celo.org/)

## Support

If you encounter issues:
1. Check the ngrok dashboard at http://localhost:4040
2. Check browser console for errors
3. Check Next.js dev server logs
4. Review MiniPay documentation

