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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="text-gray-500 mt-1">Everything happening in your gift circles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active circles', value: groups.length, icon: '👥', color: 'bg-orange-50 text-orange-700' },
          { label: 'Gifts claimed', value: claims.length, icon: '✅', color: 'bg-green-50 text-green-700' },
          { label: 'Total pledged', value: `$${claims.reduce((s, c) => s + (c.pledgeAmount || 0), 0).toFixed(0)}`, icon: '💰', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Members across groups', value: Array.from(new Set(groups.flatMap(g => g.members.map(m => m.user.displayName)))).length, icon: '🎉', color: 'bg-pink-50 text-pink-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm opacity-75">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Groups */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Your Gift Circles</h2>
          <Link href="/dashboard/groups/new" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
            + New circle
          </Link>
        </div>
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-orange-100">
            <div className="text-5xl mb-3">🎄</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No gift circles yet</h3>
            <p className="text-gray-400 text-sm mb-5">Create one to start organizing your next gift exchange.</p>
            <Link href="/dashboard/groups/new" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Create your first circle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <Link key={group.id} href={`/dashboard/groups/${group.id}`}
                className="bg-white rounded-2xl p-5 border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{group.name}</h3>
                {group.description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{group.description}</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">{group.members.length} member{group.members.length !== 1 ? 's' : ''}</span>
                  <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">{group._count.wishlistItems} wish{group._count.wishlistItems !== 1 ? 'es' : ''}</span>
                  {group.budget && <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">${group.budget} budget</span>}
                  {group.exchangeDate && (
                    <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full">
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gifts you&apos;re getting</h2>
          <div className="space-y-3">
            {claims.slice(0, 5).map(claim => (
              <div key={claim.id} className="bg-white rounded-2xl px-5 py-4 border border-orange-100 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{claim.wishlistItem.title}</div>
                  <div className="text-sm text-gray-400">
                    for <span className="text-orange-600">{claim.wishlistItem.user.displayName}</span> · {claim.wishlistItem.group.name}
                  </div>
                </div>
                {claim.pledgeAmount && (
                  <div className="text-green-600 font-bold">${claim.pledgeAmount}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
