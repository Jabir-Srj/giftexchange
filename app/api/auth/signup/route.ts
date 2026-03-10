import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json()

    if (!email || !password || !displayName) {
      return apiError('Email, password, and display name are required')
    }

    if (password.length < 8) {
      return apiError('Password must be at least 8 characters')
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return apiError('An account with this email already exists', 409)
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, passwordHash, displayName },
    })

    const token = signToken({ userId: user.id, email: user.email, displayName: user.displayName })

    return apiSuccess({
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    }, 201)
  } catch (err) {
    console.error(err)
    return apiError('Internal server error', 500)
  }
}
