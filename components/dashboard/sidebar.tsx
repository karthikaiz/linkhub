'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Link as LinkIcon,
  Palette,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/links', label: 'Links', icon: LinkIcon },
  { href: '/appearance', label: 'Appearance', icon: Palette },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    username?: string | null
    image?: string | null
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-[#e8e4de] z-40 flex items-center justify-between px-4">
        <Link href="/dashboard" className="text-xl font-bold text-[#2d3029]">
          Link<span className="text-[#7c9885]">Hub</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-[#f5f2ed] transition-colors text-[#2d3029]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 bg-white border-r border-[#e8e4de] z-50 flex flex-col transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#e8e4de]">
          <Link href="/dashboard" className="text-xl font-bold text-[#2d3029]">
            Link<span className="text-[#7c9885]">Hub</span>
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="p-4">
          <div className="bg-[#f9f9f7] rounded-2xl p-4 border border-[#e8e4de]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#7c9885] flex items-center justify-center text-white font-semibold shadow-lg shadow-[#7c9885]/20 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2d3029] truncate">{user.name || 'User'}</p>
                <p className="text-sm text-[#6b6b66] truncate">@{user.username}</p>
              </div>
            </div>
            {user.username && (
              <Link
                href={`/${user.username}`}
                target="_blank"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-white rounded-xl text-sm font-medium text-[#2d3029] hover:bg-[#f5f2ed] transition-colors border border-[#e8e4de]"
              >
                <ExternalLink className="w-4 h-4" />
                View Live Page
              </Link>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#7c9885] text-white shadow-lg shadow-[#7c9885]/20'
                      : 'text-[#5c5c57] hover:bg-[#f5f2ed] hover:text-[#2d3029]'
                  )}
                >
                  <Icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', isActive && 'text-white')} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-[#e8e4de]">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#5c5c57] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
