'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('Message sent! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="max-w-xl mx-auto px-4 py-16">
        <Link href="/" className="text-[#7c9885] hover:underline mb-8 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-4 text-[#2d3029]">Contact Us</h1>
        <p className="text-[#6b6b66] mb-8">
          Have a question or feedback? We'd love to hear from you.
        </p>

        <div className="bg-white rounded-2xl border border-[#e8e4de] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="rounded-xl border-[#e8e4de] focus:border-[#7c9885] focus:ring-[#7c9885]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="rounded-xl border-[#e8e4de] focus:border-[#7c9885] focus:ring-[#7c9885]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#2d3029]">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we help?"
                required
                rows={5}
                className="flex w-full rounded-xl border border-[#e8e4de] bg-white px-3 py-2 text-sm placeholder:text-[#a8a8a3] focus:outline-none focus:ring-2 focus:ring-[#7c9885] focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-[#7c9885] hover:bg-[#6b8872] text-white"
              isLoading={isLoading}
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
