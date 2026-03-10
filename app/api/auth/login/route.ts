import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return apiError('Email and password are required')
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return apiError('Invalid email or password', 401)
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return apiError('Invalid email or password', 401)
    }

    const token = signToken({ userId: user.id, email: user.email, displayName: user.displayName })

    return apiSuccess({
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    })
  } catch (err) {
    console.error(err)
    return apiError('Internal server error', 500)
  }
}
