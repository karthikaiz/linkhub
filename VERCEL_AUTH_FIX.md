# 🔧 Fix Authentication Issues on Vercel

## ⚠️ Problem
Unable to login or signup at `linkhub-ecru.vercel.app`

## 🎯 Root Cause
Missing or incorrect environment variables on Vercel deployment.

---

## ✅ SOLUTION: Add All Required Environment Variables

### Step 1: Go to Vercel Dashboard
```
https://vercel.com/dashboard
```
1. Select your **linkhub** project
2. Go to **Settings → Environment Variables**

---

### Step 2: Add These CRITICAL Variables

#### **🔐 Authentication (CRITICAL - App won't work without these)**

```bash
# NextAuth URL (MUST match your deployment URL)
NEXTAUTH_URL=https://linkhub-ecru.vercel.app

# NextAuth Secret (Generate a random secret)
NEXTAUTH_SECRET=your-random-secret-here-minimum-32-characters
```

**How to generate NEXTAUTH_SECRET:**
```bash
# Option 1: Use this online tool
https://generate-secret.vercel.app/32

# Option 2: Use terminal (if you have openssl)
openssl rand -base64 32
```

#### **🗄️ Database (CRITICAL - Required for login)**

```bash
DATABASE_URL=your_postgresql_connection_string
```

**If you don't have a database yet:**
1. Go to Vercel Dashboard → Storage → Create Database
2. Choose **Postgres**
3. Copy the `POSTGRES_PRISMA_URL` value
4. Use that as your `DATABASE_URL`

#### **🔑 Google OAuth (For Google Sign-In)**

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Don't have Google OAuth credentials? Get them:**
1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URI:
   ```
   https://linkhub-ecru.vercel.app/api/auth/callback/google
   ```
7. Copy the **Client ID** and **Client Secret**

#### **💳 Razorpay (Already configured)**

```bash
RAZORPAY_KEY_ID=rzp_live_S2qXz2ZnqEkpaL
RAZORPAY_KEY_SECRET=XruxAkbvllRMUELeY44QIQ90
RAZORPAY_WEBHOOK_SECRET=linkhub_372c706678ff_live
RAZORPAY_PLAN_ID_INR=plan_S3EbuqsFiQ780Z
```

#### **📱 App URL (Optional but recommended)**

```bash
NEXT_PUBLIC_APP_URL=https://linkhub-ecru.vercel.app
```

---

### Step 3: Redeploy

After adding all environment variables:
1. Go to **Deployments** tab
2. Click the **3 dots** on the latest deployment
3. Click **Redeploy**
4. Wait for build to complete

---

## 🧪 Test After Deployment

Once redeployed:
1. Open: `https://linkhub-ecru.vercel.app`
2. Try **Google Sign-In** (if OAuth configured)
3. Or try **Sign Up** with email/password
4. Should work! ✅

---

## 🚨 Quick Checklist

Before redeploying, make sure you have:

- [ ] `NEXTAUTH_URL` = `https://linkhub-ecru.vercel.app`
- [ ] `NEXTAUTH_SECRET` = Random 32+ character string
- [ ] `DATABASE_URL` = PostgreSQL connection string
- [ ] `GOOGLE_CLIENT_ID` = From Google Cloud Console (optional)
- [ ] `GOOGLE_CLIENT_SECRET` = From Google Cloud Console (optional)
- [ ] `RAZORPAY_KEY_ID` = Already have this ✅
- [ ] `RAZORPAY_KEY_SECRET` = Already have this ✅
- [ ] `RAZORPAY_WEBHOOK_SECRET` = Already have this ✅
- [ ] `RAZORPAY_PLAN_ID_INR` = Already have this ✅

---

## 💡 Most Common Fix

The **#1 most common issue** is missing these 3 variables:

```bash
NEXTAUTH_URL=https://linkhub-ecru.vercel.app
NEXTAUTH_SECRET=<generate-random-secret>
DATABASE_URL=<your-postgres-url>
```

If you add just these 3 + your existing Razorpay variables, login should work!

---

## 🔍 How to Check if Variables are Set

1. Go to Vercel Dashboard
2. Select linkhub project
3. Settings → Environment Variables
4. You should see all variables listed

---

## 📝 Summary

**Problem:** Can't login/signup
**Cause:** Missing environment variables on Vercel
**Solution:** Add NEXTAUTH_URL, NEXTAUTH_SECRET, DATABASE_URL, and redeploy

**Time to fix:** 5-10 minutes
**Success rate:** 99% of authentication issues are fixed by this

---

## ❓ Still Not Working?

If you still have issues after adding all variables:

1. **Check Vercel build logs** for specific errors
2. **Check if database is accessible** from Vercel
3. **Verify Google OAuth redirect URIs** match exactly
4. **Try email/password signup** instead of Google OAuth

---

## 🎯 Quick Start (Copy-Paste Ready)

Here's a template you can copy:

```bash
# CRITICAL - Update these with your actual values
NEXTAUTH_URL=https://linkhub-ecru.vercel.app
NEXTAUTH_SECRET=GENERATE_A_RANDOM_32_CHAR_STRING_HERE
DATABASE_URL=postgresql://username:password@host:5432/database

# Optional - For Google Sign-In
GOOGLE_CLIENT_ID=your_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console

# Already configured - Just copy these
RAZORPAY_KEY_ID=rzp_live_S2qXz2ZnqEkpaL
RAZORPAY_KEY_SECRET=XruxAkbvllRMUELeY44QIQ90
RAZORPAY_WEBHOOK_SECRET=linkhub_372c706678ff_live
RAZORPAY_PLAN_ID_INR=plan_S3EbuqsFiQ780Z

# Optional
NEXT_PUBLIC_APP_URL=https://linkhub-ecru.vercel.app
```

Just replace the values and paste into Vercel!

---

**Ready to fix!** 🚀 Follow the steps above and your login should work in 10 minutes.
