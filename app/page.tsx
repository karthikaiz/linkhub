import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 overflow-hidden">
      {/* Floating Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/40 to-purple-300/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gradient-to-br from-cyan-300/40 to-blue-300/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-yellow-200/40 to-pink-300/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-gradient-to-br from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl animate-blob animation-delay-3000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg shadow-purple-500/5 border border-white/50">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              LinkHub
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg shadow-purple-500/25 border-0">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-sm border border-purple-100 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-600">Made for Indian Creators</span>
          <span className="text-lg">🇮🇳</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in leading-tight">
          <span className="text-gray-800">One Link.</span>
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Endless Possibilities.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up font-medium">
          Your aesthetic link-in-bio page with
          <span className="text-purple-600 font-semibold"> UPI tips</span>,
          <span className="text-pink-600 font-semibold"> analytics</span> &
          <span className="text-cyan-600 font-semibold"> vibes</span> ✨
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 shadow-xl shadow-purple-500/30 border-0 font-semibold">
              Create Your LinkHub - It's Free 🚀
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 hover:bg-white text-gray-700 font-semibold">
              See the Magic ✨
            </Button>
          </Link>
        </div>

        {/* Demo Preview - Phone Mockup */}
        <div className="mt-20 max-w-xs mx-auto animate-float">
          {/* Phone Frame */}
          <div className="relative">
            {/* Phone outer frame */}
            <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-purple-500/20">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10 flex items-center justify-center">
                <div className="w-16 h-4 bg-black rounded-full"></div>
              </div>
              {/* Phone screen */}
              <div className="bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-200 rounded-[2.3rem] p-6 pt-8 min-h-[480px]">
                {/* Profile */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 rounded-full mx-auto mb-3 shadow-lg shadow-purple-400/30 flex items-center justify-center text-3xl">
                    👩‍🎨
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">@priya.creates</h3>
                  <p className="text-gray-600 text-sm">Artist & Content Creator 🎨</p>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-3 mb-5">
                  {['📸', '🎵', '📺', '💼'].map((icon, i) => (
                    <div key={i} className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center text-lg shadow-sm hover:scale-110 transition-transform cursor-pointer">
                      {icon}
                    </div>
                  ))}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {[
                    { text: 'My Art Portfolio', color: 'from-pink-400 to-rose-400' },
                    { text: 'YouTube Channel', color: 'from-purple-400 to-indigo-400' },
                    { text: 'Buy Me a Chai ☕', color: 'from-amber-400 to-orange-400' },
                    { text: 'Join Newsletter', color: 'from-cyan-400 to-teal-400' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-r ${item.color} text-white py-3 px-4 rounded-2xl text-center font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* Tip Jar Preview */}
                <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">💜 Support my work</span>
                    <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full">UPI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements around phone */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-3 py-2 shadow-lg animate-bounce-slow">
              <span className="text-sm font-semibold">+2.5k views 📈</span>
            </div>
            <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl px-3 py-2 shadow-lg animate-bounce-slow animation-delay-1000">
              <span className="text-sm font-semibold">₹499 earned 💰</span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Free forever
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> No credit card needed
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Setup in 2 minutes
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
              ₹0<span className="text-lg text-gray-500 font-normal">/month</span>
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
              ₹299<span className="text-lg text-primary-200 font-normal">/month</span>
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
