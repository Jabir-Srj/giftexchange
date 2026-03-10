'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface InviteData {
  id: string
  email: string
  accepted: boolean
  group: { id: string; name: string; description: string | null }
}

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    fetch(`/api/invite/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setInvite(data.invite)
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleAccept = async () => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push(`/login?redirect=/invite/${token}`)
      return
    }

    setJoining(true)
    const res = await fetch(`/api/invite/${token}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${storedToken}` },
    })
    const data = await res.json()
    setJoining(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    router.push(`/dashboard/groups/${data.groupId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-orange-500 animate-pulse text-2xl">Loading invite...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <span className="text-2xl">🎁</span>
        <span className="text-xl font-bold text-orange-600">GiftCircle</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        {error ? (
          <>
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid invite</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link href="/dashboard" className="text-orange-600 font-medium hover:underline">
              Go to dashboard
            </Link>
          </>
        ) : invite ? (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re invited!</h1>
            <p className="text-gray-500 mb-2">You&apos;ve been invited to join</p>
            <div className="bg-orange-50 rounded-xl px-6 py-4 mb-6">
              <h2 className="text-xl font-bold text-orange-700">{invite.group.name}</h2>
              {invite.group.description && (
                <p className="text-gray-500 text-sm mt-1">{invite.group.description}</p>
              )}
            </div>
            <button
              onClick={handleAccept}
              disabled={joining}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all"
            >
              {joining ? 'Joining...' : 'Join this gift circle 🎁'}
            </button>
            <p className="text-sm text-gray-400 mt-4">
              You&apos;ll need to sign in or create an account to join.
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}
