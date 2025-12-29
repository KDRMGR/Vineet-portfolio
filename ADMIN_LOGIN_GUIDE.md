# Admin Login Setup Guide

## ✅ You've Completed:
1. ✅ Run SQL schema in Supabase
2. ✅ Created admin user in Supabase

---

## 🔐 How to Login

### Step 1: Navigate to Login Page
```
http://localhost:5174/login
```

### Step 2: Enter Your Credentials
- **Email**: The email you created in Supabase Authentication
- **Password**: The password you set for that user

### Step 3: Verify Email (if needed)
Check if your user is **confirmed** in Supabase:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find your user
4. Check if "Email Confirmed" shows a ✅
5. If not, click the **"..."** menu → **Send Magic Link** or **Confirm Email**

---

## 🐛 Troubleshooting Login Issues

### Issue 1: "Invalid login credentials"
**Cause**: Wrong email/password or unconfirmed email

**Solutions**:
1. Double-check your email and password
2. Verify email is confirmed in Supabase Dashboard
3. Try resetting password in Supabase:
   - Authentication → Users → Click user → Reset Password

### Issue 2: "Network error" or "Failed to fetch"
**Cause**: Supabase connection issue

**Solution**:
Open browser console (F12) and check for errors. Verify:
```javascript
// In src/lib/supabase.ts
const supabaseUrl = 'https://vdkyezqasgzksftfopet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Issue 3: Redirects to login after entering credentials
**Cause**: Session not persisting

**Solution**:
1. Clear browser cache and cookies
2. Try incognito/private mode
3. Check browser console for errors

---

## 🔍 Debug Steps

### 1. Check Browser Console
Press **F12** and look for errors when you try to login.

### 2. Verify Supabase Configuration
```bash
# Check if environment variables are correct
cat src/lib/supabase.ts
```

Should show:
```typescript
const supabaseUrl = 'https://vdkyezqasgzksftfopet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka3llenFhc2d6a3NmdGZvcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDkzODgsImV4cCI6MjA4MjUyNTM4OH0.O1UNYeDLiV1WLr5BgAd4ArHnQ1xBKsSkcpTEP-GyLEA';
```

### 3. Test Supabase Connection
Open browser console on `/login` page and run:
```javascript
// Should log connection status
console.log('Testing Supabase connection...');
```

### 4. Confirm User in Supabase
In Supabase Dashboard:
- **Authentication** → **Users**
- Your user should show:
  - ✅ Email confirmed
  - ✅ Last sign in (after login attempt)

---

## 📝 Manual User Confirmation (If Needed)

If your user is not confirmed:

### Option 1: Using Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Find your user
3. Click **"..."** menu
4. Select **"Confirm Email"**

### Option 2: Using SQL Editor
```sql
-- Confirm the user
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'your-admin-email@example.com';
```

---

## ✨ After Successful Login

Once logged in, you'll be redirected to:
```
http://localhost:5174/admin
```

You can then:
- ✅ Edit website content
- ✅ Manage gallery images
- ✅ Update text for all pages

---

## 🔄 Reset Everything (If Stuck)

### 1. Delete and Recreate User
```sql
-- In Supabase SQL Editor
DELETE FROM auth.users WHERE email = 'your-email@example.com';
```

Then create a new user in Authentication tab.

### 2. Clear Browser Data
- Clear all cookies for localhost:5174
- Clear local storage
- Try in incognito mode

---

## 📞 Common Login Flow

1. **Visit**: http://localhost:5174/login
2. **Enter**: Email and password
3. **Click**: Sign In button
4. **Redirects to**: http://localhost:5174/admin (if successful)
5. **See**: Admin Dashboard with Content/Gallery tabs

---

## 🎯 Test Credentials Format

Your credentials should look like:
```
Email: admin@vineetlabdhe.com
Password: YourSecurePassword123!
```

**NOT**:
- Username (use email)
- Supabase project password
- API key as password

---

## 🚀 Quick Test

Try this test user creation:

1. **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** or **"Invite user"**
3. Enter:
   - Email: `test@admin.com`
   - Password: `Test123!@#`
   - ✅ Auto Confirm User
4. Save
5. Try logging in with these credentials

---

## Need Help?

If still having issues:
1. Check browser console (F12) for error messages
2. Check Supabase logs (Dashboard → Logs)
3. Verify user is confirmed
4. Try different browser

---

**Remember**: The login uses Supabase Authentication, not a custom auth system!
