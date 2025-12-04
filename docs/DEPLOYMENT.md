# Todone Deployment Guide

This guide covers various deployment options for Todone.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides seamless deployment for Vite applications:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Or use the Vercel dashboard**:
   - Import your Git repository
   - Vercel auto-detects Vite configuration
   - Deploy with one click

**Configuration**: Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 2. Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

**Configuration**: Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Docker

Build and run using Docker:

```bash
docker build -t todone .
docker run -p 4173:4173 todone
```

**For production with Docker Compose**:
```yaml
version: '3.8'
services:
  todone:
    build: .
    ports:
      - "4173:4173"
    restart: unless-stopped
```

### 4. Static Hosting (GitHub Pages, S3, etc.)

After building:

```bash
npm run build
```

Upload the contents of the `dist/` directory to your static host.

**GitHub Pages example**:
```bash
npm run build
cd dist
git init
git add -A
git commit -m 'Deploy Todone'
git push -f git@github.com:username/todone.git main:gh-pages
```

### 5. Self-Hosted (VPS/DigitalOcean/AWS)

1. **Upload files** to your server
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build**:
   ```bash
   npm run build
   ```
4. **Serve** using a web server like Nginx:

**Nginx configuration**:
```nginx
server {
    listen 80;
    server_name todone.example.com;
    root /var/www/todone/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

## Environment Variables

Create a `.env` file (not included in the repository for security):

```env
# Backend API (when ready)
VITE_API_URL=https://api.todone.app

# Feature flags
VITE_ENABLE_AI=true
VITE_ENABLE_SYNC=false
```

## Performance Optimization

### Code Splitting
Already enabled via Vite. Routes are lazy-loaded.

### Asset Optimization
- Images: Use WebP format
- SVGs: Inline small icons, external for large
- Fonts: Use system fonts (already configured)

### Caching
Configure caching headers in your web server:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN
For global performance, use a CDN like:
- Cloudflare
- AWS CloudFront
- Fastly

## Monitoring

### Error Tracking
Integrate Sentry or similar:

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### Analytics
Add Google Analytics, Plausible, or similar.

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Todone

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Database Considerations

Currently uses IndexedDB (client-side). For cloud sync (future):

- PostgreSQL for backend
- Redis for caching
- S3 for file attachments

## Security

- **HTTPS**: Always use HTTPS in production
- **Content Security Policy**: Configure CSP headers
- **Rate Limiting**: Implement on backend API
- **Authentication**: Secure JWT tokens, rotate secrets

## Backup & Recovery

IndexedDB data is local. Future cloud sync will handle backups automatically.

**Export functionality**:
Users can export their data as JSON from the app (planned feature).

## Scaling

For high traffic (future):

- Use a load balancer
- Horizontal scaling of API servers
- Database read replicas
- CDN for static assets

## Troubleshooting

### Build Fails
- Clear node_modules and reinstall
- Check Node version (must be 18+)
- Run `npm run typecheck` to identify type errors

### Runtime Errors
- Check browser console
- Verify IndexedDB is enabled
- Clear browser cache

### Slow Performance
- Check bundle size: `npm run build -- --analyze`
- Enable gzip compression
- Use a CDN

## Post-Deployment Checklist

- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Error tracking configured
- [ ] Analytics setup (optional)
- [ ] Custom domain configured
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify IndexedDB functionality
- [ ] Check page load performance (< 2s)

## Support

For deployment issues, open an issue on GitHub with:
- Deployment platform
- Error logs
- Browser/device info

---

**Deploy with confidence! Todone is built to scale.** 🚀
