'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]+$/
    return regex.test(username) && username.length >= 3 && username.length <= 20
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    if (!validateUsername(formData.username)) {
      setErrors({ username: 'Username must be 3-20 characters, letters, numbers, and underscores only' })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.error })
        } else {
          toast.error(data.error || 'Something went wrong')
        }
        return
      }

      toast.success('Account created successfully!')

      // Auto sign in
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary-600 mb-2">
            LinkHub
          </Link>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Start sharing your links in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-gray-500 text-sm">
                  linkhub.com/
                </span>
                <Input
                  type="text"
                  placeholder="yourname"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                  className="rounded-l-none"
                  required
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-primary-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
