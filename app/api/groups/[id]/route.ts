import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const group = await prisma.group.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { id: true, displayName: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, displayName: true, email: true } },
        },
      },
      invites: true,
      wishlistItems: {
        include: {
          user: { select: { id: true, displayName: true } },
          claim: {
            include: {
              claimedBy: { select: { id: true, displayName: true } },
            },
          },
        },
      },
    },
  })

  if (!group) return apiError('Group not found', 404)

  // Check membership
  const isMember = group.members.some(m => m.userId === user.userId)
  if (!isMember) return apiError('Not a member of this group', 403)

  // Hide claim info from item owner (but show to others)
  const sanitized = {
    ...group,
    wishlistItems: group.wishlistItems.map(item => ({
      ...item,
      claim: item.userId === user.userId ? (item.claim ? { claimed: true } : null) : item.claim,
    })),
  }

  return apiSuccess({ group: sanitized })
}
