import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | LinkHub',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="text-[#7c9885] hover:underline mb-8 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-[#2d3029]">Terms of Service</h1>

        <div className="bg-white rounded-2xl border border-[#e8e4de] p-8 shadow-sm">
          <p className="text-[#6b6b66] mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">1. Acceptance of Terms</h2>
          <p className="text-[#5c5c57] mb-4">
            By accessing and using LinkHub, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">2. Description of Service</h2>
          <p className="text-[#5c5c57] mb-4">
            LinkHub provides a link-in-bio service that allows users to create customizable pages to share multiple links through a single URL.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">3. User Accounts</h2>
          <p className="text-[#5c5c57] mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information when creating your account.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">4. Acceptable Use</h2>
          <p className="text-[#5c5c57] mb-4">
            You agree not to use LinkHub for any unlawful purpose, to share harmful or malicious content, or to violate any applicable laws or regulations.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">5. Subscriptions and Payments</h2>
          <p className="text-[#5c5c57] mb-4">
            Pro subscriptions are billed monthly. You can cancel at any time, and your subscription will remain active until the end of the billing period.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">6. Termination</h2>
          <p className="text-[#5c5c57] mb-4">
            We reserve the right to suspend or terminate accounts that violate these terms or for any other reason at our discretion.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">7. Limitation of Liability</h2>
          <p className="text-[#5c5c57] mb-4">
            LinkHub is provided "as is" without warranties. We are not liable for any damages arising from your use of the service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-[#2d3029]">8. Changes to Terms</h2>
          <p className="text-[#5c5c57] mb-4">
            We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  )
}
