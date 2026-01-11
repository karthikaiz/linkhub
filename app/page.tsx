import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            LinkHub
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
          One Link for
          <span className="text-primary-600"> Everything</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
          Create a beautiful, customizable page to share all your important links.
          Perfect for creators, businesses, and anyone who wants to simplify their online presence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Create Your LinkHub - Free
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-lg px-8">
              See Features
            </Button>
          </Link>
        </div>

        {/* Demo Preview */}
        <div className="mt-16 max-w-sm mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full mx-auto mb-4"></div>
            <h3 className="font-bold text-xl mb-1">@yourname</h3>
            <p className="text-gray-500 text-sm mb-6">Creator & Entrepreneur</p>
            <div className="space-y-3">
              {['My Website', 'YouTube Channel', 'Newsletter', 'Shop'].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-900 text-white py-3 px-4 rounded-full text-center font-medium hover:scale-105 transition-transform cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Easy to Use',
              description: 'Set up your page in under 2 minutes. No technical skills required.',
              icon: '✨',
            },
            {
              title: 'Fully Customizable',
              description: 'Choose colors, fonts, and layouts that match your brand.',
              icon: '🎨',
            },
            {
              title: 'Analytics',
              description: 'Track clicks and views to understand your audience.',
              icon: '📊',
            },
            {
              title: 'Mobile Optimized',
              description: 'Looks perfect on every device, every time.',
              icon: '📱',
            },
            {
              title: 'Fast & Reliable',
              description: 'Lightning-fast load times. 99.9% uptime guaranteed.',
              icon: '⚡',
            },
            {
              title: 'SEO Friendly',
              description: 'Help people discover you with optimized pages.',
              icon: '🔍',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Simple Pricing
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Start free, upgrade when you need more.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="font-bold text-2xl mb-2">Free</h3>
            <p className="text-gray-500 mb-4">For personal use</p>
            <div className="text-4xl font-bold mb-6">
              $0<span className="text-lg text-gray-500 font-normal">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Up to 5 links', 'Basic analytics', 'Standard themes', 'LinkHub branding'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <h3 className="font-bold text-2xl mb-2">Pro</h3>
            <p className="text-primary-100 mb-4">For creators & businesses</p>
            <div className="text-4xl font-bold mb-6">
              $5<span className="text-lg text-primary-200 font-normal">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited links',
                'Advanced analytics',
                'Custom themes',
                'No branding',
                'Priority support',
                'Custom CSS',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block">
              <Button className="w-full bg-white text-primary-600 hover:bg-gray-100">
                Start Pro Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gray-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to simplify your online presence?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of creators who use LinkHub to share their content with the world.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Create Your Free LinkHub
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600">
            &copy; {new Date().getFullYear()} LinkHub. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
