# Deployment Guide - Vineet Labdhe Portfolio

## 🚀 Deploying to Vercel

### Prerequisites
1. ✅ GitHub repository set up
2. ✅ Vercel account (free tier works)
3. ✅ Supabase project configured

---

## Step-by-Step Deployment

### 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository:
   ```
   https://github.com/KDRMGR/Vineet-portfolio
   ```

### 2. Configure Project Settings

**Framework Preset:** Vite
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### 3. Environment Variables (Optional)

If you want to use environment variables for Supabase:

Add these in Vercel Dashboard → Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://vdkyezqasgzksftfopet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Then update `src/lib/supabase.ts`:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vdkyezqasgzksftfopet.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-key';
```

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

---

## ✅ What's Included

The repository now includes:

### **vercel.json**
- ✅ Rewrites all routes to `/index.html` for SPA routing
- ✅ Security headers configured
- ✅ Cache headers for static assets

This fixes the issue where direct navigation to routes like `/login`, `/admin`, `/about` returns 404.

### **public/_redirects**
- ✅ Netlify-compatible redirects (if you switch platforms)

---

## 🔍 Testing After Deployment

### Test These Routes:
```
https://your-site.vercel.app/
https://your-site.vercel.app/about
https://your-site.vercel.app/cinematography
https://your-site.vercel.app/photography
https://your-site.vercel.app/contact
https://your-site.vercel.app/gallery/fashion
https://your-site.vercel.app/login       ← Admin login
https://your-site.vercel.app/admin       ← Admin dashboard (protected)
```

All routes should work correctly with the `vercel.json` configuration.

---

## 🐛 Troubleshooting

### Issue: Routes return 404 on refresh
**Solution:** ✅ Already fixed with `vercel.json`

The `vercel.json` file ensures all routes are rewritten to serve `index.html`, allowing React Router to handle routing.

### Issue: Admin login not working
**Causes:**
1. Supabase credentials not configured
2. User not confirmed in Supabase
3. CORS issues

**Solutions:**
1. Check `src/lib/supabase.ts` has correct credentials
2. Confirm user email in Supabase Dashboard
3. Add your Vercel domain to Supabase allowed URLs:
   - Supabase Dashboard → Authentication → URL Configuration
   - Add: `https://your-site.vercel.app`

### Issue: Images not loading in admin dashboard
**Solution:**
- Use full URLs for images
- Or upload to Supabase Storage
- Ensure CORS is enabled for image sources

---

## 🔐 Supabase Configuration for Production

### Add Vercel Domain to Supabase

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to **Redirect URLs**:
   ```
   https://your-site.vercel.app/**
   ```

### Update Site URL
Set **Site URL** to:
```
https://your-site.vercel.app
```

---

## 📊 Build Configuration

### Vercel Build Settings

The build process:
```bash
# Install dependencies
npm install

# Build the project (creates dist/ folder)
npm run build

# Vercel serves from dist/
```

### Build Output
```
dist/
├── index.html          # Main HTML file
├── assets/             # JS, CSS bundles
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg           # Favicon
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain (e.g., `vineetlabdhe.com`)
3. Configure DNS:
   - **A Record**: Point to Vercel's IP
   - **CNAME**: Point to your Vercel domain

### Update Supabase URLs
After adding custom domain, update Supabase redirect URLs to include your custom domain.

---

## 🔄 Auto-Deploy

Vercel automatically deploys when you push to GitHub:

1. **Push to `main` branch** → Triggers production deployment
2. **Push to other branches** → Creates preview deployment
3. **Pull Requests** → Automatic preview deployments

### Manual Redeploy
If needed, click **"Redeploy"** in Vercel Dashboard → Deployments

---

## 📝 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ `vercel.json` exists (for routing)
- ✅ Supabase credentials are correct in `src/lib/supabase.ts`
- ✅ Database schema is run in Supabase
- ✅ Admin user is created and confirmed
- ✅ All dependencies are in `package.json`
- ✅ Build command works locally: `npm run build`
- ✅ Preview build locally: `npm run preview`

---

## 🎯 Expected Behavior

### After Successful Deployment:

1. **Homepage** loads correctly
2. **All routes** accessible via direct URL
3. **Admin login** works at `/login`
4. **Admin dashboard** protected and functional
5. **Gallery pages** load dynamically
6. **Mobile responsive** design works

---

## 💡 Tips

### Faster Builds
- Vercel caches `node_modules`
- Use `npm ci` instead of `npm install` for reproducible builds

### Environment Variables
- Use Vercel environment variables for secrets
- Never commit API keys to Git

### Preview Deployments
- Every PR gets a unique preview URL
- Test changes before merging to main

---

## 📞 Common Deployment Issues

### Build Fails
- Check build logs in Vercel
- Test locally: `npm run build`
- Ensure all imports are correct

### Routes 404
- ✅ Fixed with `vercel.json`
- Verify file is in repository root

### Authentication Issues
- Add Vercel URL to Supabase
- Check browser console for CORS errors
- Verify environment variables

---

## 🚀 Next Steps After Deployment

1. **Test all routes** on production URL
2. **Verify admin login** works
3. **Add content** via admin dashboard
4. **Upload real images** to galleries
5. **Update social links** in contact page
6. **Configure custom domain** (optional)
7. **Set up analytics** (Google Analytics, Vercel Analytics)

---

## 📈 Monitoring

### Vercel Analytics (Free)
- Enable in Project Settings → Analytics
- Track page views, performance, and user interactions

### Supabase Logs
- Monitor authentication attempts
- Check database queries
- Review error logs

---

Your portfolio is now production-ready! 🎉

**Live URL:** https://your-project.vercel.app
**Admin:** https://your-project.vercel.app/login
