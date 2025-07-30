# GitHub Deployment Guide for CrisisMatch

## Quick 5-Minute Deployment

### Step 1: Fork or Download
1. **Fork this repository** on GitHub, or
2. **Download the zip file** and create a new repository

### Step 2: Customize for Your Disaster
```bash
# Choose your disaster template
npm run apply-template texas_floods_2025
# or
npm run apply-template california_fires_2025
# or
npm run apply-template florida_hurricane_2025
# or create your own in template-config.json
```

### Step 3: Enable GitHub Pages
1. Go to your repository **Settings**
2. Scroll to **Pages** section
3. Source: **GitHub Actions**
4. This will use the included workflow

### Step 4: Your App is Live!
- URL: `https://yourusername.github.io/your-repo-name/`
- Updates automatically when you push changes

## Automated GitHub Actions Workflow

The repository includes `.github/workflows/deploy.yml` that:
- ✅ **Builds** the React app automatically
- ✅ **Deploys** to GitHub Pages
- ✅ **Updates** on every push to main branch
- ✅ **Handles** routing for single-page app

## Repository Naming Strategy

### For Multiple Disasters
Create separate repositories for each disaster:
- `crisis-match-texas-floods-2025`
- `crisis-match-california-fires-2025`
- `crisis-match-florida-hurricane-2025`

### Benefits
- **Independent deployments** for each disaster
- **Custom domains** for each event
- **Separate data** and configurations
- **Easy management** of multiple emergencies

## Custom Domain Setup (Optional)

### Add Custom Domain
1. In repository settings, go to **Pages**
2. Add your custom domain (e.g., `texasfloods2025.org`)
3. Enable **HTTPS** (recommended)

### DNS Configuration
Point your domain to GitHub Pages:
```
CNAME: yourusername.github.io
```

## Environment Variables

### GitHub Secrets (for Supabase)
If using Supabase database:
1. Go to repository **Settings** → **Secrets**
2. Add these secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Template Variables
Automatically set by template system:
- `VITE_DEFAULT_EVENT_ID`
- `VITE_EVENT_NAME`
- `VITE_APP_TITLE`

## Workflow File

The included `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Multiple Disaster Management

### Template Repository Approach
1. **Keep this as master template**
2. **Fork for each disaster**
3. **Apply specific template**
4. **Deploy independently**

### Example Workflow
```bash
# For Texas Floods
git clone your-template-repo crisis-match-texas-floods-2025
cd crisis-match-texas-floods-2025
npm run apply-template texas_floods_2025
git add . && git commit -m "Apply Texas Floods template"
git push origin main

# For California Fires  
git clone your-template-repo crisis-match-california-fires-2025
cd crisis-match-california-fires-2025
npm run apply-template california_fires_2025
git add . && git commit -m "Apply California Fires template"
git push origin main
```

## Monitoring and Updates

### GitHub Actions Status
- Check the **Actions** tab for deployment status
- Green checkmark = successful deployment
- Red X = deployment failed (check logs)

### Update Process
1. **Make changes** to your code
2. **Push to main branch**
3. **Automatic deployment** happens
4. **Live site updates** in 2-3 minutes

## Troubleshooting

### Common Issues

**Deployment Failed**
- Check Actions tab for error logs
- Verify all required files are present
- Ensure package.json scripts are correct

**Blank Page After Deployment**
- Check browser console for errors
- Verify routing configuration in `_redirects`
- Ensure all assets are building correctly

**Template Not Applied**
- Run `npm run apply-template` locally first
- Commit and push the changes
- Check that template-config.json exists

### Support Resources
- GitHub Pages documentation
- GitHub Actions troubleshooting
- Repository Issues tab for bug reports

## Security Considerations

### Public Repositories
- **No sensitive data** in public repos
- **Use GitHub Secrets** for API keys
- **Environment variables** for configuration

### Private Repositories
- **GitHub Pro/Team** required for private Pages
- **Same deployment process**
- **Additional security** for sensitive operations

## Performance Optimization

### Build Optimization
- **Automatic minification** in production build
- **Asset optimization** through Vite
- **PWA caching** for offline functionality

### CDN Benefits
- **Global distribution** through GitHub's CDN
- **Fast loading** worldwide
- **Automatic HTTPS** and security headers

## Backup and Recovery

### Repository Backup
- **Multiple forks** for redundancy
- **Local clones** on multiple machines
- **Export data** regularly if using database

### Disaster Recovery
- **Quick redeployment** from any fork
- **Template system** for rapid setup
- **Documentation** for emergency procedures

Your CrisisMatch deployment will be live and ready for emergency use within minutes of following this guide!

