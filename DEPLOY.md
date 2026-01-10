# Super Simple Deployment Guide

## What You Need

1. Your Vercel account (you have this!)
2. A Stripe account (free - takes 2 minutes to create)
3. 10 minutes of your time

---

## STEP 1: Create a Stripe Account

1. Go to **https://stripe.com**
2. Click "Start now" and create an account
3. You can stay in "Test mode" until you're ready to accept real payments

---

## STEP 2: Get Your Stripe Keys

1. In Stripe Dashboard, click **Developers** (top right)
2. Click **API keys**
3. Copy the **Secret key** (starts with `sk_test_...`)
4. Save it in a notepad - you'll need it soon

---

## STEP 3: Create Your $5/month Product in Stripe

1. In Stripe Dashboard, click **Products**
2. Click **+ Add product**
3. Fill in:
   - Name: `LinkHub Pro`
   - Price: `$5.00`
   - Billing period: `Monthly`
4. Click **Save product**
5. Click on the product you just created
6. Copy the **Price ID** (starts with `price_...`)
7. Save it in your notepad

---

## STEP 4: Deploy to Vercel

1. Create a new GitHub repository
2. Upload all the files in this `linkhub` folder to it
3. Go to **https://vercel.com/new**
4. Click **Import** on your repository
5. Before clicking Deploy, click **Environment Variables**
6. Add these variables one by one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` (you'll update this after deploy) |
| `DATABASE_URL` | (we'll get this next) |
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` |
| `NEXTAUTH_SECRET` | `just-type-any-random-32-character-string-here` |
| `STRIPE_SECRET_KEY` | Your `sk_test_...` key from Step 2 |
| `STRIPE_WEBHOOK_SECRET` | `placeholder` (we'll update this after deploy) |
| `STRIPE_PRO_PRICE_ID` | Your `price_...` ID from Step 3 |

7. Click **Deploy**
8. Wait for it to complete (about 2 minutes)

---

## STEP 5: Add the Database

1. After deploy, click on your project in Vercel
2. Go to **Storage** tab
3. Click **Create Database** > **Postgres**
4. Name it `linkhub-db`, click **Create**
5. Once created, click **Connect** and it will automatically add `DATABASE_URL`

---

## STEP 6: Set Up the Database Tables

1. In your project, go to **Settings** > **Functions**
2. Or just visit: `https://your-app.vercel.app/api/auth/register` - this will error but trigger the DB setup
3. Actually, the easiest way: Redeploy the app after adding the database:
   - Go to **Deployments** tab
   - Click the **...** menu on the latest deployment
   - Click **Redeploy**

---

## STEP 7: Set Up Stripe Webhooks

1. Go back to Stripe Dashboard
2. Click **Developers** > **Webhooks**
3. Click **Add endpoint**
4. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
5. Click **Select events** and choose:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
6. Click **Add endpoint**
7. Click on your new webhook
8. Click **Reveal** under "Signing secret"
9. Copy the `whsec_...` secret
10. Go back to Vercel > Your Project > Settings > Environment Variables
11. Update `STRIPE_WEBHOOK_SECRET` with your `whsec_...` value
12. Redeploy the app

---

## STEP 8: Update Your App URL

1. In Vercel, copy your actual app URL (e.g., `https://linkhub-abc123.vercel.app`)
2. Go to Settings > Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` with your real URL
4. Redeploy

---

## YOU'RE DONE!

Visit your app URL and:
1. Click "Get Started Free"
2. Create an account
3. Add some links
4. Share your profile!

---

## Going Live with Real Payments

When you're ready to accept real money:
1. In Stripe, click **Activate your account**
2. Complete the business verification
3. Switch from test mode to live mode
4. Replace your `sk_test_` key with your `sk_live_` key
5. Create a new product/price in live mode
6. Update your Vercel environment variables
7. Redeploy

---

## Getting to $1000/month

You need: **200 Pro subscribers at $5/month**

How to get there:
- Post on Twitter/X about your launch
- Share on Reddit (r/SideProject, r/startups, r/Entrepreneur)
- Submit to Product Hunt
- Write blog posts comparing to Linktree
- Run a simple Google Ads campaign targeting "linktree alternative"
- Offer 20% commission to affiliates

Good luck!
