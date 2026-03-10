import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.userId },
    include: {
      group: {
        include: {
          owner: { select: { id: true, displayName: true, email: true } },
          members: { include: { user: { select: { id: true, displayName: true, email: true } } } },
          _count: { select: { wishlistItems: true } },
        },
      },
    },
  })

  const groups = memberships.map(m => m.group)
  return apiSuccess({ groups })
}

export async function POST(req: NextRequest) {
  const userPayload = getUserFromRequest(req)
  if (!userPayload) return apiError('Unauthorized', 401)

  const { name, description, exchangeDate, budget } = await req.json()

  if (!name?.trim()) return apiError('Group name is required')

  const group = await prisma.group.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      ownerId: userPayload.userId,
      exchangeDate: exchangeDate ? new Date(exchangeDate) : null,
      budget: budget ? parseFloat(budget) : null,
    },
  })

  // Auto-add owner as member
  await prisma.groupMember.create({
    data: { groupId: group.id, userId: userPayload.userId },
  })

  return apiSuccess({ group }, 201)
}
