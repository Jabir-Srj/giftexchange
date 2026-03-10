'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface WishlistItem {
  id: string
  title: string
  description: string | null
  url: string | null
  price: number | null
  group: { id: string; name: string }
  claim: { claimed: boolean; pledgeAmount?: number | null } | null
}

interface GroupWithItems {
  group: { id: string; name: string }
  items: WishlistItem[]
}

export default function MyWishlistPage() {
  const [groupedItems, setGroupedItems] = useState<GroupWithItems[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    // Get groups first, then wishlist items for each
    const groupsRes = await fetch('/api/groups', { headers: { Authorization: `Bearer ${token}` } })
    const groupsData = await groupsRes.json()
    const groups = groupsData.groups || []

    const results: GroupWithItems[] = []
    for (const group of groups) {
      const itemsRes = await fetch(`/api/wishlist?groupId=${group.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const itemsData = await itemsRes.json()
      const myItems = (itemsData.items || []).filter((i: WishlistItem & { userId?: string }) => {
        // We only have items from the wishlist API — filter by checking group
        return true
      })
      // Get only my items from the group detail
      const groupRes = await fetch(`/api/groups/${group.id}`, { headers: { Authorization: `Bearer ${token}` } })
      const groupData = await groupRes.json()
      const meRes = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      const meData = await meRes.json()
      const myId = meData.user?.id
      const myGroupItems = (groupData.group?.wishlistItems || []).filter((i: { userId: string }) => i.userId === myId)
      results.push({ group: { id: group.id, name: group.name }, items: myGroupItems })
    }

    setGroupedItems(results.filter(g => g.items.length > 0 || true))
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <div className="text-orange-400 animate-pulse py-8">Loading wishlist...</div>

  const allItems = groupedItems.flatMap(g => g.items)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-500 mt-1">Items you&apos;ve added across all your gift circles</p>
      </div>

      {allItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-orange-100">
          <div className="text-6xl mb-4">🎀</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-400 mb-6">Add gift ideas to your wishlists inside each group.</p>
          <Link href="/dashboard/groups" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            Go to my groups
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedItems.map(({ group, items }) => items.length > 0 && (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-bold text-gray-800">{group.name}</h2>
                <Link href={`/dashboard/groups/${group.id}`} className="text-xs text-orange-500 hover:underline">View group →</Link>
              </div>
              <div className="space-y-3">
                {items.map((item: WishlistItem) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 border border-orange-100 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{item.title}</span>
                        {item.price && <span className="text-sm text-green-600 font-semibold">${item.price}</span>}
                        {item.claim && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            🎁 Someone&apos;s got this!
                          </span>
                        )}
                      </div>
                      {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 hover:underline mt-1 block">
                          🔗 View item
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
