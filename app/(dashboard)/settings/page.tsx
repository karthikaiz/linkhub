import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserSubscriptionPlan, PLANS } from '@/lib/razorpay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionButton } from '@/components/dashboard/subscription-button'
import { DeleteAccountButton } from '@/components/dashboard/delete-account-button'
import { formatDate } from '@/lib/utils'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  const [user, plan] = await Promise.all([
    db.user.findUnique({
      where: { id: session!.user.id },
      select: { name: true, email: true, username: true, createdAt: true },
    }),
    getUserSubscriptionPlan(session!.user.id),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account and subscription</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1">{user?.name || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="mt-1">@{user?.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="mt-1">{formatDate(user!.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{plan.name} Plan</h3>
                {plan.isPro && (
                  <span className="bg-primary-100 text-primary-600 text-xs font-medium px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-gray-600">{plan.description}</p>
              {plan.subscriptionEndDate && (
                <p className="text-sm text-gray-500 mt-1">
                  {plan.isPro
                    ? `Renews on ${formatDate(plan.subscriptionEndDate)}`
                    : `Expired on ${formatDate(plan.subscriptionEndDate)}`}
                </p>
              )}
            </div>
            <SubscriptionButton isPro={plan.isPro || false} />
          </div>

          {/* Plan Comparison */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className={`p-6 rounded-lg border-2 ${!plan.isPro ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <h4 className="font-bold text-lg">{PLANS.free.name}</h4>
              <p className="text-3xl font-bold mt-2">
                $0<span className="text-sm text-gray-500 font-normal">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                {PLANS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan */}
            <div className={`p-6 rounded-lg border-2 ${plan.isPro ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg">{PLANS.pro.name}</h4>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
                  Popular
                </span>
              </div>
              <p className="text-3xl font-bold mt-2">
                ₹{PLANS.pro.price.INR}<span className="text-sm text-gray-500 font-normal">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                {PLANS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  )
}
