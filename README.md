# LinkHub - Link-in-Bio Tool

A beautiful, customizable link-in-bio tool similar to Linktree. Built with Next.js 14, Tailwind CSS, Prisma, and Stripe.

## Features

- User authentication (email/password)
- Customizable profile pages
- Link management (add, edit, delete, reorder)
- Click analytics
- Theme customization
- Pro subscription with Stripe ($5/month)
- Mobile-responsive design

## Quick Deployment Guide

### Prerequisites

1. A [Vercel](https://vercel.com) account (you have this!)
2. A [Stripe](https://stripe.com) account (free to create)

### Step 1: Set Up the Database (2 minutes)

1. Go to your Vercel dashboard
2. Click on "Storage" in the top nav
3. Click "Create Database" > "Postgres"
4. Name it "linkhub-db" and click Create
5. Copy the `DATABASE_URL` from the ".env.local" tab - you'll need this!

### Step 2: Set Up Stripe (5 minutes)

1. Go to [stripe.com](https://stripe.com) and create a free account
2. In the Stripe Dashboard:
   - Click "Developers" > "API keys"
   - Copy your **Secret key** (starts with `sk_test_`)
3. Create a Pro subscription product:
   - Go to "Products" > "Add Product"
   - Name: "LinkHub Pro"
   - Price: $5/month (recurring)
   - Click "Save"
   - Copy the **Price ID** (starts with `price_`)
4. Set up webhook:
   - Go to "Developers" > "Webhooks"
   - Click "Add endpoint"
   - URL: `https://your-app-url.vercel.app/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

### Step 3: Deploy to Vercel (3 minutes)

1. Push this code to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add these environment variables:

```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
DATABASE_URL=your_database_url_from_step_1
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=run_this_command_openssl_rand_base64_32
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRO_PRICE_ID=price_your_id
```

5. Click "Deploy"

### Step 4: Initialize the Database

After deployment, run this command in your terminal:

```bash
npx prisma db push
```

Or in Vercel, you can run it from the deployment logs.

That's it! Your LinkHub is live!

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Push the database schema:
   ```bash
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Customization

### Change the name "LinkHub"

Search and replace "LinkHub" with your preferred name in:
- `app/layout.tsx` (site title)
- `app/page.tsx` (landing page)
- `components/dashboard/nav.tsx` (dashboard)

### Change colors

Edit `tailwind.config.ts` to modify the primary color scheme.

### Pricing

Modify `lib/stripe.ts` to change:
- Plan names
- Features
- Link limits

## Revenue Potential

With 200 Pro subscribers at $5/month:
- Gross revenue: $1,000/month
- Stripe fees (~3%): -$30
- Net revenue: ~$970/month

## Marketing Tips

1. Share on social media
2. Post in relevant subreddits (r/SideProject, r/startups)
3. Submit to Product Hunt
4. Create content about "Linktree alternatives"
5. Offer affiliate commissions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Hosting**: Vercel

## License

MIT - Feel free to use this for your own SaaS!
