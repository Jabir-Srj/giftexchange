'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  displayName: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (!r.ok) throw new Error('Unauthorized')
        return r.json()
      })
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-pulse">🎁</div>
          <div className="text-cream-300 text-sm font-medium">Loading your gift circles…</div>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { href: '/dashboard/groups', label: 'My Groups', icon: '◎' },
    { href: '/dashboard/wishlist', label: 'Wishlist', icon: '♡' },
    { href: '/dashboard/claimed', label: 'Claimed', icon: '✓' },
  ]

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-primary-900 flex">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 min-h-screen sticky top-0 h-screen"
        style={{
          background: 'rgba(10,10,22,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <span className="font-display font-bold text-lg" style={{ color: '#f5c842' }}>GiftCircle</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={active ? {
                  background: 'rgba(245,200,66,0.12)',
                  color: '#f5c842',
                  borderLeft: '2px solid #f5c842',
                } : {
                  color: 'rgba(253,246,236,0.5)',
                  borderLeft: '2px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fdf6ec'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(253,246,236,0.5)'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                  }
                }}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* New circle button */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link
            href="/dashboard/groups/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-primary-900 transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #f5c842 0%, #e8b020 100%)',
              boxShadow: '0 4px 16px rgba(245,200,66,0.2)',
            }}
          >
            + New Circle
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-900 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #f5c842, #e8b020)' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-cream-100 text-sm font-semibold truncate">{user?.displayName}</div>
              <div className="text-cream-400 text-xs truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-xs text-cream-500 hover:text-coral-400 transition-colors w-full text-left"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{
            background: 'rgba(10,10,22,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <span>🎁</span>
            <span className="font-display font-bold" style={{ color: '#f5c842' }}>GiftCircle</span>
          </Link>
          <button onClick={logout} className="text-xs text-cream-400 hover:text-coral-400 transition-colors">
            Sign out
          </button>
        </header>

        <main className="flex-1 px-4 md:px-8 py-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-10"
        style={{
          background: 'rgba(10,10,22,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex justify-around py-2">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs transition-colors"
                style={{ color: active ? '#f5c842' : 'rgba(253,246,236,0.4)' }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label.split(' ').pop()}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
