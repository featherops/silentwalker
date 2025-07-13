# Silent Walker Server - Deployment Guide

## Quick Deploy Options

### 1. Heroku (Recommended)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create new app
heroku create your-silent-walker-app

# Deploy
git add .
git commit -m "Initial deployment"
git push heroku main

# Open app
heroku open
```

### 2. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 3. Render
```bash
# Connect your GitHub repo to Render
# Set build command: npm install
# Set start command: node server.js
# Deploy automatically
```

### 4. Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Environment Variables

Set these in your deployment platform:

```env
PORT=3000
NODE_ENV=production
```

## Manual Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access the dashboard:**
   - Open browser to `http://localhost:3000`

## Important Notes

- The server uses in-memory storage (devices are lost on restart)
- For production, consider adding a database (MongoDB, PostgreSQL, etc.)
- Update the `SERVER_URL` in the Android app after deployment
- The server runs on port 3000 by default

## Testing the Deployment

1. Deploy the server
2. Update `NetworkUtils.kt` in the Android app with your server URL
3. Build and install the Android app
4. Test the complete flow

## Troubleshooting

- **Port issues**: Set PORT environment variable
- **CORS errors**: CORS is enabled for all origins (configure as needed)
- **Memory issues**: Consider upgrading your deployment plan 