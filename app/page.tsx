import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] overflow-hidden">
      {/* Subtle Organic Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#d4e4d7]/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#e8d5c4]/50 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-[#c9dcd0]/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-4 sm:px-6 py-3 shadow-sm border border-[#e8e4de]">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-[#2d3029]">
              Link<span className="text-[#7c9885]">Hub</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl text-[#5c5c57] hover:text-[#2d3029] hover:bg-[#f5f2ed] px-3 sm:px-4">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl bg-[#7c9885] hover:bg-[#6b8872] text-white shadow-md shadow-[#7c9885]/20 border-0 text-sm sm:text-base px-3 sm:px-4">
                  <span className="hidden sm:inline">Get Started Free</span>
                  <span className="sm:hidden">Start Free</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-8 shadow-sm border border-[#e8e4de] animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c9885] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7c9885]"></span>
          </span>
          <span className="text-sm font-medium text-[#5c5c57]">Made for Indian Creators</span>
          <span className="text-lg">🇮🇳</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight tracking-tight">
          <span className="text-[#2d3029]">One Link.</span>
          <br />
          <span className="text-[#7c9885]">Infinite Reach.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-[#6b6b66] mb-10 max-w-2xl mx-auto animate-slide-up">
          Turn Your Followers into a Business. All in One Click with 
          <span className="text-[#7c9885] font-semibold"> UPI tips</span> &
          <span className="text-[#c77b58] font-semibold"> detailed user analytics</span> 
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6 rounded-2xl bg-[#2d3029] hover:bg-[#3d403a] text-white shadow-lg shadow-[#2d3029]/20 border-0 font-medium">
              Create Your LinkHub — Free
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl bg-white border-2 border-[#e8e4de] hover:border-[#7c9885] hover:bg-[#faf8f5] text-[#2d3029] font-medium">
              See Features
            </Button>
          </Link>
        </div>

        {/* Demo Preview - Phone Mockup */}
        <div className="mt-20 max-w-xs mx-auto animate-float">
          {/* Phone Frame */}
          <div className="relative">
            {/* Phone outer frame */}
            <div className="bg-[#2d3029] rounded-[3rem] p-3 shadow-2xl shadow-[#2d3029]/20">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#2d3029] rounded-b-2xl z-10 flex items-center justify-center">
                <div className="w-16 h-4 bg-black rounded-full"></div>
              </div>
              {/* Phone screen */}
              <div className="bg-[#fdfbf7] rounded-[2.3rem] p-6 pt-8 min-h-[480px]">
                {/* Profile */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#7c9885] to-[#5f7a64] rounded-full mx-auto mb-3 shadow-lg shadow-[#7c9885]/30 flex items-center justify-center text-3xl">
                    🎨
                  </div>
                  <h3 className="font-bold text-lg text-[#2d3029]">@priya.creates</h3>
                  <p className="text-[#6b6b66] text-sm">Artist & Content Creator</p>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-3 mb-5">
                  {['📸', '🎵', '📺', '💼'].map((icon, i) => (
                    <div key={i} className="w-9 h-9 bg-[#f5f2ed] rounded-full flex items-center justify-center text-lg shadow-sm hover:scale-110 transition-transform cursor-pointer border border-[#e8e4de]">
                      {icon}
                    </div>
                  ))}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {[
                    { text: 'My Art Portfolio', bg: 'bg-[#2d3029]', textColor: 'text-white' },
                    { text: 'YouTube Channel', bg: 'bg-[#7c9885]', textColor: 'text-white' },
                    { text: 'Buy Me a Chai ☕', bg: 'bg-[#c77b58]', textColor: 'text-white' },
                    { text: 'Join Newsletter', bg: 'bg-[#f5f2ed] border border-[#e8e4de]', textColor: 'text-[#2d3029]' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`${item.bg} ${item.textColor} py-3 px-4 rounded-xl text-center font-medium text-sm shadow-sm hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* Tip Jar Preview */}
                <div className="mt-4 bg-[#f5f2ed] rounded-xl p-3 border border-[#e8e4de]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5c5c57]">Support my work</span>
                    <span className="text-xs bg-[#7c9885] text-white px-2 py-1 rounded-full">UPI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements around phone */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl px-3 py-2 shadow-md border border-[#e8e4de] animate-bounce-slow">
              <span className="text-sm font-semibold text-[#2d3029]">+2.5k views</span>
            </div>
            <div className="absolute -bottom-2 -left-4 bg-white rounded-xl px-3 py-2 shadow-md border border-[#e8e4de] animate-bounce-slow animation-delay-1000">
              <span className="text-sm font-semibold text-[#7c9885]">₹499 earned</span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[#6b6b66] text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#7c9885]/20 flex items-center justify-center">
              <span className="text-[#7c9885] text-xs">✓</span>
            </span>
            Free forever
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#7c9885]/20 flex items-center justify-center">
              <span className="text-[#7c9885] text-xs">✓</span>
            </span>
            No credit card
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#7c9885]/20 flex items-center justify-center">
              <span className="text-[#7c9885] text-xs">✓</span>
            </span>
            2 min setup
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
              description: 'Launch in 120 Seconds. No code, no stress. Just your best links in a beautiful layout.',
              icon: '✨',
            },
            {
              title: 'Fully Customizable',
              description: 'Your Brand, Your Rules. Match your LinkHub to your Instagram aesthetic with custom themes and fonts.',
              icon: '🎨',
            },
            {
              title: 'Analytics',
              description: 'Know Your Superfans. See exactly where your traffic comes from and which links are winning.',
              icon: '📊',
            },
            {
              title: 'Mobile Optimized',
              description: "Blazing Fast on Every Phone. Designed for India's mobile-first audience. No lag, just clicks.",
              icon: '📱',
            },
            {
              title: 'UPI Tip Jar',
              description: 'Monetize Effortlessly. Let fans support your work directly via UPI. No high platform fees—just your money..',
              icon: '⚡',
            },
            // {
            //   title: 'SEO Friendly',
            //   description: 'Help people discover you with optimized pages.',
            //   icon: '🔍',
            // },
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2d3029]">
          Simple Pricing
        </h2>
        <p className="text-[#6b6b66] text-center mb-12">
          Start free, upgrade when you need more.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[#e8e4de] hover:border-[#7c9885] transition-colors">
            <h3 className="font-bold text-2xl mb-2 text-[#2d3029]">Free</h3>
            <p className="text-[#6b6b66] mb-4">For personal use</p>
            <div className="text-4xl font-bold mb-6 text-[#2d3029]">
              ₹0<span className="text-lg text-[#6b6b66] font-normal">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Up to 5 links', 'Basic analytics', 'Standard themes', 'LinkHub branding'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#5c5c57]">
                  <span className="w-5 h-5 rounded-full bg-[#7c9885]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#7c9885]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block">
              <Button variant="outline" className="w-full rounded-xl border-2 border-[#e8e4de] hover:border-[#7c9885] text-[#2d3029] hover:bg-[#f5f2ed]">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#2d3029] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#2d3029]/30">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c9885]/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#c77b58]/20 rounded-full blur-2xl" />

            <div className="relative">
              <div className="inline-block bg-[#c77b58] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                MOST POPULAR
              </div>
              <h3 className="font-bold text-2xl mb-2">Pro</h3>
              <p className="text-[#a8a8a3] mb-4">For creators & businesses</p>
              <div className="text-4xl font-bold mb-6">
                ₹299<span className="text-lg text-[#a8a8a3] font-normal">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited links',
                  'Advanced analytics',
                  'Premium themes',
                  'No branding',
                  'UPI Tip Jar',
                  'Priority support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#e8e4de]">
                    <span className="w-5 h-5 rounded-full bg-[#7c9885] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full rounded-xl bg-[#7c9885] hover:bg-[#6b8872] text-white font-semibold shadow-lg shadow-[#7c9885]/30">
                  Start Pro Trial
                </Button>
              </Link>
            </div>
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
