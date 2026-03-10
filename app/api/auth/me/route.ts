import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return apiError('Unauthorized', 401)

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, displayName: true, createdAt: true },
  })

  if (!user) return apiError('User not found', 404)

  return apiSuccess({ user })
}
