'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      return
    }

    localStorage.setItem('token', data.token)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-primary-900 flex overflow-hidden">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1e1e55 0%, #0f0f1a 60%, #2a1a2e 100%)' }}
      >
        {/* blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 blob pointer-events-none" style={{ background: '#f5c842', opacity: 0.1 }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 blob pointer-events-none" style={{ background: '#ff6b6b', opacity: 0.08 }} />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
          <span className="text-2xl">🎁</span>
          <span className="text-xl font-bold font-display" style={{ color: '#f5c842' }}>GiftCircle</span>
        </Link>

        {/* Center quote */}
        <div className="relative z-10 space-y-6">
          <h2
            className="font-display text-4xl xl:text-5xl font-bold leading-tight"
            style={{ color: '#fdf6ec' }}
          >
            Every gift tells<br />
            <em className="not-italic" style={{
              background: 'linear-gradient(135deg, #f5c842, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>a story.</em>
          </h2>
          <p className="text-cream-300 text-lg leading-relaxed max-w-sm">
            Sign in to your gift circles and continue making memories with the people who matter most.
          </p>

          {/* Fake testimonial */}
          <div className="glass rounded-2xl p-5 max-w-sm">
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f5c842' }}>★</span>)}
            </div>
            <p className="text-cream-200 text-sm italic leading-relaxed">
              &ldquo;GiftCircle made our family Christmas so much easier and more special. I can&apos;t imagine going back!&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-900" style={{ background: '#f5c842' }}>SM</div>
              <div>
                <div className="text-cream-100 text-xs font-semibold">Sarah M.</div>
                <div className="text-cream-400 text-xs">Family of 8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-cream-500 text-xs">
          © 2026 GiftCircle
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 min-h-screen">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <span className="text-2xl">🎁</span>
          <span className="text-xl font-bold font-display" style={{ color: '#f5c842' }}>GiftCircle</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-cream-100 mb-2">Welcome back</h1>
            <p className="text-cream-300 text-sm">Sign in to see your gift circles and wishlists.</p>
          </div>

          {error && (
            <div
              className="text-sm px-4 py-3 rounded-xl mb-5"
              style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', color: '#ff9f9f' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-cream-200 mb-2">Email</label>
              <input
                type="email"
                required
                placeholder="sarah@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm text-cream-100 placeholder-cream-500 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid rgba(245,200,66,0.5)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream-200 mb-2">Password</label>
              <input
                type="password"
                required
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm text-cream-100 placeholder-cream-500 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1px solid rgba(245,200,66,0.5)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,200,66,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3.5 rounded-xl text-sm transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed text-primary-900"
              style={{
                background: 'linear-gradient(135deg, #f5c842 0%, #e8b020 100%)',
                boxShadow: '0 6px 24px rgba(245,200,66,0.3)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-cream-400 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: '#f5c842' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
