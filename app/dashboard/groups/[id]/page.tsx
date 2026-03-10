'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface User { id: string; displayName: string; email: string }
interface Claim { claimed?: boolean; claimedBy?: { id: string; displayName: string }; pledgeAmount?: number | null; id?: string; createdAt?: string }
interface WishlistItem {
  id: string
  userId: string
  title: string
  description: string | null
  url: string | null
  price: number | null
  user: { id: string; displayName: string }
  claim: Claim | null
}
interface GroupInvite { id: string; email: string; accepted: boolean; token: string }
interface Group {
  id: string
  name: string
  description: string | null
  budget: number | null
  exchangeDate: string | null
  ownerId: string
  owner: User
  members: { user: User }[]
  invites: GroupInvite[]
  wishlistItems: WishlistItem[]
}

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [group, setGroup] = useState<Group | null>(null)
  const [currentUserId, setCurrentUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'wishlist' | 'members' | 'invites'>('wishlist')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteResult, setInviteResult] = useState('')
  const [inviting, setInviting] = useState(false)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [pledgeAmount, setPledgeAmount] = useState('')
  const [claimTarget, setClaimTarget] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchGroup = () => {
    const token = localStorage.getItem('token')
    return fetch(`/api/groups/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.group) setGroup(d.group) })
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    // Get current user id
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setCurrentUserId(d.user?.id || ''))

    fetchGroup().finally(() => setLoading(false))
  }, [id])

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviting(true)
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/groups/${id}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email: inviteEmail }),
    })
    const data = await res.json()
    setInviting(false)
    if (res.ok) {
      setInviteResult(`Invite link: ${data.inviteUrl}`)
      setInviteEmail('')
      fetchGroup()
    } else {
      setError(data.error)
    }
  }

  const claimItem = async (itemId: string) => {
    setClaiming(itemId)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ wishlistItemId: itemId, pledgeAmount: pledgeAmount ? parseFloat(pledgeAmount) : null }),
    })
    const data = await res.json()
    setClaiming(null)
    setClaimTarget(null)
    setPledgeAmount('')
    if (res.ok) fetchGroup()
    else setError(data.error)
  }

  const unclaimItem = async (itemId: string) => {
    setClaiming(itemId)
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/claims?wishlistItemId=${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setClaiming(null)
    if (res.ok) fetchGroup()
  }

  if (loading) return <div className="text-orange-400 animate-pulse py-8">Loading group...</div>
  if (!group) return <div className="py-8 text-red-500">Group not found.</div>

  const isOwner = group.ownerId === currentUserId

  // Group wishlist items by user
  const itemsByUser = group.members.map(m => ({
    user: m.user,
    items: group.wishlistItems.filter(i => i.userId === m.user.id),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/groups" className="text-sm text-orange-500 hover:underline">← All circles</Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mt-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            {group.description && <p className="text-gray-500 mt-1">{group.description}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              {group.budget && <span className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full">💰 ${group.budget} budget</span>}
              {group.exchangeDate && (
                <span className="text-sm bg-pink-50 text-pink-600 px-3 py-1 rounded-full">
                  📅 {new Date(group.exchangeDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              <span className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded-full">👥 {group.members.length} members</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl" onClick={() => setError('')}>{error} ✕</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-orange-100">
        {(['wishlist', 'members', ...(isOwner ? ['invites'] : [])] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'wishlist' ? '🎀 Wishlists' : tab === 'members' ? '👥 Members' : '📧 Invites'}
          </button>
        ))}
      </div>

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-8">
          {itemsByUser.map(({ user, items }) => (
            <div key={user.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.displayName[0].toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-800">{user.displayName}&apos;s wishlist</h3>
                {user.id === currentUserId && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">You</span>
                )}
              </div>

              {/* My wishlist item adder */}
              {user.id === currentUserId && (
                <AddWishlistItemForm groupId={group.id} onAdded={fetchGroup} />
              )}

              {items.length === 0 ? (
                <p className="text-gray-400 text-sm italic px-4">No items added yet.</p>
              ) : (
                <div className="space-y-3">
                  {items.map(item => {
                    const isMyItem = item.userId === currentUserId
                    const isClaimed = !!item.claim
                    const iClaimedIt = !isMyItem && item.claim && (item.claim as Claim & { claimedBy?: {id:string} }).claimedBy?.id === currentUserId

                    return (
                      <div key={item.id} className="bg-white rounded-2xl p-4 border border-orange-100 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">{item.title}</span>
                            {item.price && <span className="text-sm text-green-600 font-semibold">${item.price}</span>}
                            {isClaimed && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {isMyItem ? '🎁 Someone&apos;s getting this!' : iClaimedIt ? '✅ You claimed this' : '✅ Claimed'}
                              </span>
                            )}
                          </div>
                          {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-orange-500 hover:underline mt-1 block truncate"
                            >
                              🔗 {item.url}
                            </a>
                          )}
                        </div>

                        {!isMyItem && (
                          <div className="shrink-0">
                            {iClaimedIt ? (
                              <button
                                onClick={() => unclaimItem(item.id)}
                                disabled={claiming === item.id}
                                className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                              >
                                {claiming === item.id ? '...' : 'Unclaim'}
                              </button>
                            ) : !isClaimed ? (
                              claimTarget === item.id ? (
                                <div className="flex flex-col gap-2 w-36">
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Pledge $ (optional)"
                                    value={pledgeAmount}
                                    onChange={e => setPledgeAmount(e.target.value)}
                                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-300"
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => claimItem(item.id)}
                                      disabled={claiming === item.id}
                                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 rounded-lg transition-colors"
                                    >
                                      {claiming === item.id ? '...' : 'Confirm'}
                                    </button>
                                    <button
                                      onClick={() => setClaimTarget(null)}
                                      className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setClaimTarget(item.id)}
                                  className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold px-3 py-1.5 rounded-xl transition-colors"
                                >
                                  🎁 I&apos;ll get this
                                </button>
                              )
                            ) : null}
                          </div>
                        )}

                        {isMyItem && (
                          <DeleteItemButton itemId={item.id} onDeleted={fetchGroup} />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-3">
          {group.members.map(m => (
            <div key={m.user.id} className="bg-white rounded-2xl px-5 py-4 border border-orange-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                {m.user.displayName[0].toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900">{m.user.displayName}</div>
                <div className="text-sm text-gray-400">{m.user.email}</div>
              </div>
              <div className="ml-auto flex gap-2 flex-wrap">
                {m.user.id === group.ownerId && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Owner</span>
                )}
                {m.user.id === currentUserId && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invites Tab */}
      {activeTab === 'invites' && isOwner && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-orange-100">
            <h3 className="font-bold text-gray-900 mb-4">Invite someone by email</h3>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="friend@example.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
              />
              <button
                onClick={sendInvite}
                disabled={inviting}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                {inviting ? '...' : 'Send'}
              </button>
            </div>
            {inviteResult && (
              <div className="mt-3 p-3 bg-green-50 rounded-xl text-sm text-green-700 break-all">
                ✅ {inviteResult}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">Pending invites</h3>
            {group.invites.filter(i => !i.accepted).length === 0 ? (
              <p className="text-gray-400 text-sm italic">No pending invites.</p>
            ) : (
              <div className="space-y-2">
                {group.invites.filter(i => !i.accepted).map(invite => (
                  <div key={invite.id} className="bg-white rounded-xl px-4 py-3 border border-orange-100 flex items-center justify-between">
                    <span className="text-sm text-gray-700">{invite.email}</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Sub-component: Add wishlist item form
function AddWishlistItemForm({ groupId, onAdded }: { groupId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', url: '', price: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ groupId, ...form }),
    })
    setLoading(false)
    if (res.ok) {
      setForm({ title: '', description: '', url: '', price: '' })
      setOpen(false)
      onAdded()
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="mb-3 text-sm text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
      >
        + Add item to your wishlist
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-orange-50 rounded-2xl p-4 mb-3 space-y-3">
      <input
        required
        placeholder="Gift idea (e.g. LEGO Botanical Collection)"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
      />
      <input
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
      />
      <div className="flex gap-2">
        <input
          placeholder="Link (optional)"
          value={form.url}
          onChange={e => setForm({ ...form, url: e.target.value })}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          {loading ? 'Adding...' : 'Add item'}
        </button>
        <button type="button" onClick={() => setOpen(false)}
          className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function DeleteItemButton({ itemId, onDeleted }: { itemId: string; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Remove this item from your wishlist?')) return
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/wishlist?id=${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setLoading(false)
    if (res.ok) onDeleted()
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2"
    >
      {loading ? '...' : '🗑️'}
    </button>
  )
}
