'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Group {
  id: string
  name: string
  description: string | null
  exchangeDate: string | null
  budget: number | null
  members: { user: { displayName: string; email: string } }[]
  _count: { wishlistItems: number }
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/groups', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setGroups(d.groups || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-orange-400 animate-pulse py-8">Loading groups...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Gift Circles</h1>
          <p className="text-gray-500 mt-1">Groups you&apos;re a part of</p>
        </div>
        <Link href="/dashboard/groups/new"
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-5 py-2.5 rounded-full transition-all shadow-sm"
        >
          + Create circle
        </Link>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-orange-100">
          <div className="text-6xl mb-4">🎄</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No gift circles yet</h3>
          <p className="text-gray-400 mb-6">Create a group to coordinate gifts with friends and family.</p>
          <Link href="/dashboard/groups/new" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            Create your first circle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map(group => (
            <Link key={group.id} href={`/dashboard/groups/${group.id}`}
              className="bg-white rounded-2xl p-6 border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{group.name}</h3>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">{group.members.length} people</span>
              </div>
              {group.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{group.description}</p>}
              <div className="flex flex-wrap gap-2">
                {group.budget && <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">💰 ${group.budget} budget</span>}
                {group.exchangeDate && (
                  <span className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full">
                    📅 {new Date(group.exchangeDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">🎀 {group._count.wishlistItems} items</span>
              </div>
              <div className="mt-4 flex -space-x-2">
                {group.members.slice(0, 6).map((m, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {m.user.displayName[0].toUpperCase()}
                  </div>
                ))}
                {group.members.length > 6 && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold">
                    +{group.members.length - 6}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
