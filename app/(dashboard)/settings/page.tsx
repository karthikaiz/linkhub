import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserSubscriptionPlan, PLANS } from '@/lib/razorpay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionButton } from '@/components/dashboard/subscription-button'
import { DeleteAccountButton } from '@/components/dashboard/delete-account-button'
import { UsernameEditor } from '@/components/dashboard/username-editor'
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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3029]">Settings</h1>
        <p className="text-[#6b6b66]">Manage your account and subscription</p>
      </div>

      {/* Username / Profile URL */}
      <UsernameEditor currentUsername={user?.username || ''} />

      {/* Account Info */}
      <Card className="border-[#e8e4de] bg-white">
        <CardHeader>
          <CardTitle className="text-[#2d3029]">Account</CardTitle>
          <CardDescription className="text-[#6b6b66]">Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#6b6b66]">Name</label>
              <p className="mt-1 text-[#2d3029]">{user?.name || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b6b66]">Email</label>
              <p className="mt-1 text-[#2d3029]">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b6b66]">Username</label>
              <p className="mt-1 text-[#2d3029]">@{user?.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b6b66]">Member Since</label>
              <p className="mt-1 text-[#2d3029]">{formatDate(user!.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="border-[#e8e4de] bg-white">
        <CardHeader>
          <CardTitle className="text-[#2d3029]">Subscription</CardTitle>
          <CardDescription className="text-[#6b6b66]">Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#f9f9f7] rounded-xl border border-[#e8e4de]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#2d3029]">{plan.name} Plan</h3>
                {plan.isPro && (
                  <span className="bg-[#7c9885]/20 text-[#7c9885] text-xs font-medium px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[#6b6b66]">{plan.description}</p>
              {plan.subscriptionEndDate && (
                <p className="text-sm text-[#6b6b66] mt-1">
                  {plan.isPro
                    ? `Renews on ${formatDate(plan.subscriptionEndDate)}`
                    : `Expired on ${formatDate(plan.subscriptionEndDate)}`}
                </p>
              )}
            </div>
            <SubscriptionButton isPro={plan.isPro || false} subscriptionEndDate={plan.subscriptionEndDate} />
          </div>

          {/* Plan Comparison */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className={`p-6 rounded-xl border-2 ${!plan.isPro ? 'border-[#7c9885] bg-[#7c9885]/5' : 'border-[#e8e4de]'}`}>
              <h4 className="font-bold text-lg text-[#2d3029]">{PLANS.free.name}</h4>
              <p className="text-3xl font-bold mt-2 text-[#2d3029]">
                ₹0<span className="text-sm text-[#6b6b66] font-normal">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                {PLANS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#5c5c57]">
                    <svg
                      className="w-4 h-4 text-[#7c9885]"
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
            <div className={`p-6 rounded-xl border-2 ${plan.isPro ? 'border-[#7c9885] bg-[#7c9885]/5' : 'border-[#e8e4de]'}`}>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg text-[#2d3029]">{PLANS.pro.name}</h4>
                <span className="bg-[#c77b58]/20 text-[#c77b58] text-xs font-medium px-2 py-1 rounded-full">
                  Popular
                </span>
              </div>
              <p className="text-3xl font-bold mt-2 text-[#2d3029]">
                ₹{PLANS.pro.price.INR}<span className="text-sm text-[#6b6b66] font-normal">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                {PLANS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#5c5c57]">
                    <svg
                      className="w-4 h-4 text-[#7c9885]"
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
      <Card className="border-red-200 bg-white">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription className="text-[#6b6b66]">Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#6b6b66] mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  )
}
