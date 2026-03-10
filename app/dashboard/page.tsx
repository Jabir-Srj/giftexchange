'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Group {
  id: string
  name: string
  description: string | null
  exchangeDate: string | null
  budget: number | null
  _count: { wishlistItems: number }
  members: { user: { displayName: string } }[]
}

interface Claim {
  id: string
  pledgeAmount: number | null
  wishlistItem: {
    title: string
    user: { displayName: string }
    group: { name: string }
  }
}

export default function DashboardPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [claims, setClaims] = useState<Claim[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('/api/groups', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setGroups(d.groups || []))

    fetch('/api/claims', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setClaims(d.claims || []))
  }, [])

  const totalPledged = claims.reduce((s, c) => s + (c.pledgeAmount || 0), 0)
  const uniqueMembers = Array.from(new Set(groups.flatMap(g => g.members.map(m => m.user.displayName)))).length

  const stats = [
    { label: 'Active circles', value: groups.length, icon: '◎', color: '#f5c842' },
    { label: 'Gifts claimed', value: claims.length, icon: '✓', color: '#34d399' },
    { label: 'Total pledged', value: `$${totalPledged.toFixed(0)}`, icon: '◈', color: '#ff6b6b' },
    { label: 'Total members', value: uniqueMembers, icon: '◉', color: '#a78bfa' },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-cream-100 mb-1">Your Dashboard</h1>
        <p className="text-cream-400 text-sm">Everything happening in your gift circles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl pointer-events-none"
              style={{ background: s.color, opacity: 0.15, transform: 'translate(25%, -25%)' }}
            />
            <div className="text-xl mb-3" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-2xl font-bold font-display text-cream-100 mb-1">{s.value}</div>
            <div className="text-cream-400 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Groups */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-cream-100">Your Gift Circles</h2>
          <Link
            href="/dashboard/groups/new"
            className="text-sm font-semibold px-4 py-2 rounded-full text-primary-900 transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #f5c842 0%, #e8b020 100%)',
              boxShadow: '0 4px 16px rgba(245,200,66,0.25)',
            }}
          >
            + New circle
          </Link>
        </div>

        {groups.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            <div className="text-5xl mb-4">🎄</div>
            <h3 className="text-lg font-semibold text-cream-100 mb-2">No gift circles yet</h3>
            <p className="text-cream-400 text-sm mb-6">Create one to start organizing your next gift exchange.</p>
            <Link
              href="/dashboard/groups/new"
              className="inline-block font-bold px-6 py-3 rounded-xl text-sm text-primary-900 transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f5c842 0%, #e8b020 100%)',
                boxShadow: '0 4px 16px rgba(245,200,66,0.25)',
              }}
            >
              Create your first circle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <Link
                key={group.id}
                href={`/dashboard/groups/${group.id}`}
                className="block rounded-2xl p-5 transition-all hover:-translate-y-0.5 group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.border = '1px solid rgba(245,200,66,0.3)'
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.border = '1px solid rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                  style={{ background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.2)' }}
                >
                  🎁
                </div>
                <h3 className="font-bold text-cream-100 mb-1 group-hover:text-gold-400 transition-colors">{group.name}</h3>
                {group.description && (
                  <p className="text-cream-400 text-xs mt-1 mb-3 line-clamp-2">{group.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(245,200,66,0.1)', color: '#f5c842' }}
                  >
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}
                  >
                    {group._count.wishlistItems} wish{group._count.wishlistItems !== 1 ? 'es' : ''}
                  </span>
                  {group.budget && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399' }}
                    >
                      ${group.budget} budget
                    </span>
                  )}
                  {group.exchangeDate && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(255,107,107,0.1)', color: '#ff9f9f' }}
                    >
                      {new Date(group.exchangeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent claims */}
      {claims.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-cream-100 mb-5">Gifts you&apos;re getting</h2>
          <div className="space-y-3">
            {claims.slice(0, 5).map(claim => (
              <div
                key={claim.id}
                className="rounded-2xl px-5 py-4 flex items-center justify-between"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="font-medium text-cream-100 text-sm">{claim.wishlistItem.title}</div>
                    <div className="text-xs text-cream-400">
                      for{' '}
                      <span style={{ color: '#f5c842' }}>{claim.wishlistItem.user.displayName}</span>
                      {' · '}
                      {claim.wishlistItem.group.name}
                    </div>
                  </div>
                </div>
                {claim.pledgeAmount && (
                  <div className="text-sm font-bold" style={{ color: '#34d399' }}>${claim.pledgeAmount}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
