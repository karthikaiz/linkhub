# Razorpay Integration Setup Guide

## 🎉 Migration Complete!

Your LinkHub application has been successfully migrated from Stripe to Razorpay. This guide will help you complete the setup and start accepting payments.

---

## 📋 What Changed?

### **Removed (Stripe)**
- ❌ `lib/stripe.ts`
- ❌ `app/api/stripe/*`
- ❌ `stripe` and `@stripe/stripe-js` packages
- ❌ Stripe-specific database fields

### **Added (Razorpay)**
- ✅ `lib/razorpay.ts` - Razorpay client & configuration
- ✅ `lib/geo.ts` - Geo-detection for currency
- ✅ `/api/razorpay/checkout` - Create orders/subscriptions
- ✅ `/api/razorpay/verify` - Verify payment signatures
- ✅ `/api/razorpay/webhook` - Handle webhook events
- ✅ Updated subscription button component
- ✅ Multi-currency support (INR/USD)

---

## 🚀 Setup Instructions

### **1. Create Razorpay Account**

1. Go to [razorpay.com](https://razorpay.com) and sign up
2. Complete KYC verification (PAN, GST, bank details)
3. Get approved (~2 days)

### **2. Get API Keys**

1. Log in to Razorpay Dashboard
2. Go to **Settings → API Keys**
3. Generate Test/Live keys
4. Copy `Key ID` and `Key Secret`

### **3. Create Subscription Plans (Optional)**

If you want recurring subscriptions:

1. Go to Razorpay Dashboard → Plans
2. Create two plans:
   - **INR Plan**: ₹299/month
   - **USD Plan**: $4.99/month (499 cents)
3. Copy the Plan IDs

### **4. Set Up Environment Variables**

Create a `.env.local` file with:

```bash
# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Optional: For subscription-based payments
RAZORPAY_PLAN_ID_INR=plan_xxxINRxxx
RAZORPAY_PLAN_ID_USD=plan_xxxUSDxxx

# Database
DATABASE_URL="your_database_url"

# Other env vars...
```

### **5. Update Database Schema**

Run the following command to apply database changes:

```bash
npx prisma db push
```

This will:
- Replace Stripe fields with Razorpay fields
- Add `currency` and `country` fields
- Generate Prisma client

### **6. Set Up Webhooks**

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select these events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.expired`
   - `subscription.paused`
   - `subscription.halted`
   - `payment.captured`
4. Copy the webhook secret
5. Add it to `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

---

## 💰 Pricing

### **For You (Merchant)**
- **Setup**: FREE
- **Monthly fee**: FREE
- **Transaction fees**:
  - Domestic (INR): 2% + GST
  - International (USD): 3% + GST

### **For Your Customers**
- **Free Plan**: ₹0 / $0
- **Pro Plan**: ₹299 / $4.99 per month

---

## 🌍 How Multi-Currency Works

1. **User visits checkout** → System detects country via IP
2. **India (IN)** → Shows ₹299, accepts UPI/Cards/NetBanking
3. **Other countries** → Shows $4.99, accepts international cards
4. **All payments** → Settled in INR to your Indian bank account

---

## 🧪 Testing

### **Test Mode**

Use Razorpay test credentials:

**Test Cards:**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

**Test UPI:**
```
UPI ID: success@razorpay
```

### **Test Flow**

1. Start dev server: `npm run dev`
2. Log in to your app
3. Click "Upgrade to Pro"
4. Razorpay checkout modal opens
5. Use test card details
6. Payment succeeds
7. Verification happens
8. User becomes Pro ✅

---

## 🔧 Troubleshooting

### **"Razorpay is not configured" error**
- Check that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `.env.local`

### **Webhook not working**
- Verify webhook URL is correct
- Check webhook secret matches
- Test webhook using Razorpay Dashboard → Webhooks → Test

### **Payment succeeds but user not upgraded**
- Check webhook events are configured
- Check server logs for errors
- Verify signature verification is working

### **Currency always shows USD**
- Geo-detection requires deployment on Vercel/Cloudflare
- For local testing, hardcode currency in `/lib/geo.ts`

---

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Subscription Plans Guide](https://razorpay.com/docs/payments/subscriptions/)
- [Webhook Events](https://razorpay.com/docs/webhooks/)

---

## 🎯 Next Steps

1. ✅ Complete Razorpay KYC
2. ✅ Set up environment variables
3. ✅ Push database changes
4. ✅ Configure webhooks
5. ✅ Test in test mode
6. ✅ Switch to live mode
7. ✅ Start accepting payments!

---

## 💡 Pro Tips

- **Start with test mode** - Don't go live until thoroughly tested
- **Monitor webhooks** - Set up error alerts for failed webhooks
- **Handle failures gracefully** - Show clear error messages to users
- **Add email notifications** - Send confirmation emails after successful payments
- **Create a cancellation flow** - Let users cancel subscriptions easily

---

## 📞 Support

- **Razorpay Support**: support@razorpay.com
- **Razorpay Dashboard**: [dashboard.razorpay.com](https://dashboard.razorpay.com)

---

## ✅ Implementation Checklist

- [x] Install Razorpay SDK
- [x] Update database schema
- [x] Create Razorpay lib files
- [x] Create API routes (checkout, verify, webhook)
- [x] Update UI components
- [x] Add geo-detection
- [x] Remove Stripe dependencies
- [ ] Set up Razorpay account
- [ ] Configure environment variables
- [ ] Push database changes
- [ ] Configure webhooks
- [ ] Test payments
- [ ] Go live!

---

**Need help?** Contact Razorpay support or check their extensive documentation.

Good luck with your payments! 🚀
