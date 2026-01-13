-- AlterTable: Rename Stripe columns to Razorpay columns
ALTER TABLE "User"
  RENAME COLUMN "stripeCustomerId" TO "razorpayCustomerId";

ALTER TABLE "User"
  RENAME COLUMN "stripeSubscriptionId" TO "razorpaySubscriptionId";

ALTER TABLE "User"
  RENAME COLUMN "stripePriceId" TO "razorpayPlanId";

ALTER TABLE "User"
  RENAME COLUMN "stripeCurrentPeriodEnd" TO "subscriptionEndDate";

-- AlterTable: Add new columns for multi-currency support
ALTER TABLE "User"
  ADD COLUMN "currency" TEXT DEFAULT 'INR',
  ADD COLUMN "country" TEXT;
