'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Claim {
  id: string
  pledgeAmount: number | null
  createdAt: string
  wishlistItem: {
    id: string
    title: string
    description: string | null
    url: string | null
    price: number | null
    user: { id: string; displayName: string }
    group: { id: string; name: string }
  }
}

export default function ClaimedGiftsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClaims = () => {
    const token = localStorage.getItem('token')
    fetch('/api/claims', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setClaims(d.claims || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchClaims() }, [])

  const handleUnclaim = async (itemId: string) => {
    if (!confirm('Release this claim?')) return
    const token = localStorage.getItem('token')
    await fetch(`/api/claims?wishlistItemId=${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchClaims()
  }

  const totalPledged = claims.reduce((sum, c) => sum + (c.pledgeAmount || 0), 0)

  if (loading) return <div className="text-orange-400 animate-pulse py-8">Loading claimed gifts...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gifts I&apos;m Getting</h1>
        <p className="text-gray-500 mt-1">Gifts you&apos;ve claimed — only you can see this list</p>
      </div>

      {claims.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-2xl p-5 text-green-700">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold">{claims.length}</div>
            <div className="text-sm opacity-75">Gifts claimed</div>
          </div>
          {totalPledged > 0 && (
            <div className="bg-yellow-50 rounded-2xl p-5 text-yellow-700">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-2xl font-bold">${totalPledged.toFixed(2)}</div>
              <div className="text-sm opacity-75">Total pledged</div>
            </div>
          )}
          <div className="bg-orange-50 rounded-2xl p-5 text-orange-700">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-2xl font-bold">{new Set(claims.map(c => c.wishlistItem.user.id)).size}</div>
            <div className="text-sm opacity-75">People gifted</div>
          </div>
        </div>
      )}

      {claims.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-orange-100">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No gifts claimed yet</h3>
          <p className="text-gray-400 mb-6">Browse your group wishlists and claim gifts for your friends!</p>
          <Link href="/dashboard/groups" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            Browse wishlists
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 bg-yellow-50 px-4 py-3 rounded-xl">
            🔒 This list is private. Recipients won&apos;t know who&apos;s getting them what until the exchange!
          </p>
          {claims.map(claim => (
            <div key={claim.id} className="bg-white rounded-2xl p-5 border border-orange-100 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{claim.wishlistItem.title}</span>
                  {claim.wishlistItem.price && (
                    <span className="text-sm text-green-600 font-semibold">${claim.wishlistItem.price}</span>
                  )}
                  {claim.pledgeAmount && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Pledged ${claim.pledgeAmount}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  For <span className="font-medium text-orange-600">{claim.wishlistItem.user.displayName}</span> ·{' '}
                  <Link href={`/dashboard/groups/${claim.wishlistItem.group.id}`} className="hover:underline text-gray-400">
                    {claim.wishlistItem.group.name}
                  </Link>
                </div>
                {claim.wishlistItem.description && (
                  <p className="text-sm text-gray-400 mt-1">{claim.wishlistItem.description}</p>
                )}
                {claim.wishlistItem.url && (
                  <a href={claim.wishlistItem.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-orange-500 hover:underline mt-1 inline-block"
                  >
                    🔗 View item →
                  </a>
                )}
                <div className="text-xs text-gray-300 mt-2">
                  Claimed {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </div>
              </div>
              <button
                onClick={() => handleUnclaim(claim.wishlistItem.id)}
                className="shrink-0 text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-xl border border-red-100 hover:bg-red-50 transition-colors"
              >
                Release
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
