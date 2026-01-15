import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] overflow-hidden">
      {/* Subtle Organic Shapes - Hidden on mobile */}
      <div className="hidden md:block fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#d4e4d7]/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#e8d5c4]/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-[#c9dcd0]/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2d3029]">
          Everything You Need
        </h2>
        <p className="text-[#6b6b66] text-center mb-12 max-w-xl mx-auto">
          Powerful tools designed for Indian creators to grow their audience and monetize effortlessly.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {/* Easy to Use - Sage */}
          <div className="group bg-[#7c9885] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">Easy to Use</h3>
            <p className="text-white/80 text-sm">Launch in 120 Seconds. No code, no stress. Just your best links in a beautiful layout.</p>
          </div>

          {/* Fully Customizable - Terracotta */}
          <div className="group bg-[#c77b58] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-100">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">Fully Customizable</h3>
            <p className="text-white/80 text-sm">Your Brand, Your Rules. Match your LinkHub to your Instagram aesthetic with custom themes.</p>
          </div>

          {/* Analytics - Dark */}
          <div className="group bg-[#2d3029] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-200">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">Analytics</h3>
            <p className="text-white/70 text-sm">Know Your Superfans. See exactly where your traffic comes from and which links are winning.</p>
          </div>

          {/* Mobile Optimized - Light with border */}
          <div className="group bg-white rounded-2xl p-6 border-2 border-[#e8e4de] hover:border-[#7c9885] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-300">
            <div className="w-12 h-12 bg-[#7c9885]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[#7c9885]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#2d3029]">Mobile Optimized</h3>
            <p className="text-[#6b6b66] text-sm">Blazing Fast on Every Phone. Designed for India's mobile-first audience. No lag, just clicks.</p>
          </div>

          {/* UPI Tip Jar - Gradient */}
          <div className="group bg-gradient-to-br from-[#7c9885] to-[#5f7a64] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-400">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">UPI Tip Jar</h3>
            <p className="text-white/80 text-sm">Monetize Effortlessly. Let fans support you directly via UPI. No platform fees.</p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-20">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '10K+', label: 'Creators' },
            { number: '50K+', label: 'Links Created' },
            { number: '1M+', label: 'Link Clicks' },
            { number: '99.9%', label: 'Uptime' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-2xl border border-[#e8e4de] hover:border-[#7c9885] transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-[#7c9885] mb-1">{stat.number}</div>
              <div className="text-[#6b6b66] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2d3029]">
          Loved by Creators
        </h2>
        <p className="text-[#6b6b66] text-center mb-12 max-w-xl mx-auto">
          See what Indian creators are saying about LinkHub
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Priya Sharma',
              handle: '@priyacreates',
              role: 'Artist & Illustrator',
              text: 'LinkHub made it so easy to share all my portfolio links. The UPI tip jar has been a game changer - I\'ve earned more tips in a month than I did all year!',
              color: 'bg-[#7c9885]',
            },
            {
              name: 'Rahul Verma',
              handle: '@rahulvlogs',
              role: 'YouTube Creator',
              text: 'Finally a link-in-bio that understands Indian creators. The analytics help me see exactly which content my audience loves. Highly recommend!',
              color: 'bg-[#c77b58]',
            },
            {
              name: 'Ananya Patel',
              handle: '@ananyasings',
              role: 'Music Artist',
              text: 'Clean design, fast loading, and the UPI integration is seamless. My fans can now support me directly without any international payment hassles.',
              color: 'bg-[#2d3029]',
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#e8e4de] hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-[#2d3029]">{testimonial.name}</div>
                  <div className="text-[#6b6b66] text-sm">{testimonial.handle}</div>
                </div>
              </div>
              <p className="text-[#5c5c57] text-sm mb-4">"{testimonial.text}"</p>
              <div className="text-[#7c9885] text-xs font-medium">{testimonial.role}</div>
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
        <div className="bg-[#2d3029] rounded-3xl p-12 text-center text-white relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#7c9885]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#c77b58]/20 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to grow your audience?
            </h2>
            <p className="text-[#a8a8a3] mb-8 max-w-xl mx-auto">
              Join creators across India who use LinkHub to share their content and earn from their passion.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-[#7c9885] hover:bg-[#6b8872] text-white rounded-xl shadow-lg shadow-[#7c9885]/30 font-semibold">
                Create Your Free LinkHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fdfbf7] border-t border-[#e8e4de]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="text-2xl font-bold text-[#2d3029] inline-block mb-4">
                Link<span className="text-[#7c9885]">Hub</span>
              </Link>
              <p className="text-[#6b6b66] text-sm max-w-sm">
                The link-in-bio platform built for Indian creators. Share your links, collect tips via UPI, and grow your audience.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-[#2d3029] mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="text-[#6b6b66] hover:text-[#7c9885] transition-colors">Features</Link></li>
                <li><Link href="/register" className="text-[#6b6b66] hover:text-[#7c9885] transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="text-[#6b6b66] hover:text-[#7c9885] transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-[#2d3029] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-[#6b6b66] hover:text-[#7c9885] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-[#6b6b66] hover:text-[#7c9885] transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="text-[#6b6b66] hover:text-[#7c9885] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#e8e4de] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#6b6b66] text-sm">
              &copy; {new Date().getFullYear()} LinkHub. All rights reserved.
            </p>
            <p className="text-[#6b6b66] text-sm flex items-center gap-1">
              Made with <span className="text-[#c77b58]">&#9829;</span> in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
