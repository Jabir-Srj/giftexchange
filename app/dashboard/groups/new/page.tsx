'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewGroupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    description: '',
    exchangeDate: '',
    budget: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    router.push(`/dashboard/groups/${data.group.id}`)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/groups" className="text-sm text-orange-500 hover:underline">← Back to groups</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Create a gift circle</h1>
        <p className="text-gray-500 mt-1">Set up a new group for your gift exchange.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Group name <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              placeholder="Johnson Family Christmas 2025"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              placeholder="A bit about this exchange — the occasion, theme, or rules..."
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exchange date</label>
              <input
                type="date"
                value={form.exchangeDate}
                onChange={e => setForm({ ...form, exchangeDate: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget per person ($)</label>
              <input
                type="number"
                min="0"
                step="5"
                placeholder="50"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all"
          >
            {loading ? 'Creating...' : '🎉 Create gift circle'}
          </button>
        </form>
      </div>
    </div>
  )
}
