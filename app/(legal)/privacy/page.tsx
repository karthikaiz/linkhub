import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | LinkHub',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-[#7c9885] hover:underline mb-8 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-[#2d3029]">Privacy Policy</h1>

        <div className="bg-white rounded-2xl border border-[#e8e4de] p-8 shadow-sm">
          <p className="text-[#6b6b66] mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">1. Information We Collect</h2>
          <p className="text-[#5c5c57] mb-4">
            We collect information you provide directly, including your name, email address, and username when you create an account. We also collect usage data such as page views and link clicks to provide analytics features.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">2. How We Use Your Information</h2>
          <p className="text-[#5c5c57] mb-4">
            We use your information to provide and improve our services, process transactions, send you updates, and respond to your requests.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">3. Data Security</h2>
          <p className="text-[#5c5c57] mb-4">
            We implement appropriate security measures to protect your personal information. Passwords are hashed and we use secure HTTPS connections.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">4. Third-Party Services</h2>
          <p className="text-[#5c5c57] mb-4">
            We use third-party services including Razorpay for payment processing and may use analytics tools to improve our service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">5. Your Rights</h2>
          <p className="text-[#5c5c57] mb-4">
            You can access, update, or delete your account information at any time through your dashboard settings.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">6. Contact Us</h2>
          <p className="text-[#5c5c57] mb-4">
            If you have questions about this Privacy Policy, please contact us through our <Link href="/contact" className="text-[#7c9885] hover:underline">contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
