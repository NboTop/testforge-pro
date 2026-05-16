# TestForge Pro - Deployment Guide

This guide covers deploying TestForge Pro to production environments.

---

## ✅ Production Deployment Status

**Status:** ✅ **DEPLOYED TO VERCEL**

**Production URL:** [https://testforge-void.vercel.app/](https://testforge-void.vercel.app/)

**Health Endpoint:** [https://testforge-void.vercel.app/api/health](https://testforge-void.vercel.app/api/health)

### Current Configuration

**Environment Variables (Production):**
- ✅ `GITHUB_TOKEN` - Configured for controlled PR creation
- ✅ `GITHUB_DEMO_OWNER` - Configured demo repository owner
- ✅ `GITHUB_DEMO_REPO` - Configured demo repository name
- ❌ `WATSONX_API_KEY` - Not configured (watsonx.ai integration not yet live)

**Health Check Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-05-16T14:28:00.000Z",
  "environment": "production",
  "watsonxConfigured": false,
  "githubConfigured": true
}
```

**Note:** The health endpoint returns `watsonxConfigured: false` because the WATSONX_API_KEY is not configured. The application uses template-based test generation and is architecturally watsonx.ai-ready for future integration.

---

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications and offers the simplest deployment process.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Git repository pushed to GitHub

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TestForge Pro"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/NboTop/testforge-pro.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./testforge-pro` (if in subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables (optional for demo mode):
   ```
   NEXT_PUBLIC_DEMO_MODE=true
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd testforge-pro
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? testforge-pro
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables (Optional)

For production with real APIs:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following variables:

```bash
# GitHub API (for controlled PR creation in demo repository)
GITHUB_TOKEN=ghp_your_token_here
GITHUB_DEMO_OWNER=your-github-username
GITHUB_DEMO_REPO=your-demo-repo-name

# IBM watsonx.ai (for real AI test generation - not yet implemented)
WATSONX_API_KEY=your_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_REGION=us-south
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2

# Application
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

3. Redeploy to apply changes

**Note:** Real PR creation only works for the exact repository specified in `GITHUB_DEMO_OWNER` and `GITHUB_DEMO_REPO`. All other repositories will use simulated preview mode.

---

## 🐳 Docker Deployment

### Create Dockerfile

**File:** `Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Update next.config.ts

Add standalone output:

```typescript
const nextConfig = {
  output: 'standalone',
  // ... other config
};
```

### Build and Run

```bash
# Build Docker image
docker build -t testforge-pro .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_DEMO_MODE=true \
  testforge-pro

# With environment file
docker run -p 3000:3000 --env-file .env.local testforge-pro
```

---

## 🌐 Custom Domain Setup (Optional)

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Remove or secure all API keys
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false` for production
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS if needed
- [ ] Set up rate limiting for API routes
- [ ] Review and update Content Security Policy
- [ ] Enable security headers in `next.config.ts`
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategy
- [ ] Test all features in production environment

---

## 📊 Monitoring & Analytics

### Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs

# Configure in sentry.client.config.ts and sentry.server.config.ts
```

---

## 🧪 Testing Deployment

After deployment, verify:

```bash
# Check if site is accessible
curl -I https://your-app.vercel.app

# Test API endpoints
curl -X POST https://your-app.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/test/repo"}'

# Check environment variables are loaded
# Visit: https://your-app.vercel.app
# Open browser console and check for demo mode indicator
```

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Repository analysis works
- [ ] Test generation displays code
- [ ] PR creation shows success message
- [ ] All loading states work
- [ ] Error handling displays properly
- [ ] Mobile responsive design works
- [ ] All links and buttons functional

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** `Module not found` errors
**Solution:** 
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Working

**Issue:** Variables not accessible in client
**Solution:** Ensure client-side variables start with `NEXT_PUBLIC_`

### API Routes Return 404

**Issue:** API routes not found in production
**Solution:** Verify routes are in `app/api/` directory and properly exported

### Slow Performance

**Issue:** Application loads slowly
**Solution:**
- Enable Next.js Image Optimization
- Implement code splitting
- Add caching headers
- Use CDN for static assets

---

## 📈 Scaling Considerations

### For High Traffic:

1. **Enable Edge Functions** (Vercel)
   - Faster response times globally
   - Automatic scaling

2. **Implement Caching**
   ```typescript
   // In API routes
   export const revalidate = 3600; // Cache for 1 hour
   ```

3. **Database Integration**
   - Store analysis results
   - Cache generated tests
   - Track usage metrics

4. **Rate Limiting**
   ```typescript
   // Implement in API routes
   import rateLimit from 'express-rate-limit';
   ```

---

## 🎯 Production Checklist

Before going live:

- [ ] All features tested in staging
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Monitoring and analytics set up
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on deployment process
- [ ] Rollback plan documented

---

## 📞 Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Project Documentation: See README.md and other guides in the repository

---

**Built with IBM Bob for the IBM Bob Hackathon 2026**