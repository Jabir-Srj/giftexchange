import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

// POST - claim an item (or update pledge)
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const { wishlistItemId, pledgeAmount } = await req.json()
  if (!wishlistItemId) return apiError('wishlistItemId required')

  const item = await prisma.wishlistItem.findUnique({
    where: { id: wishlistItemId },
    include: { claim: true },
  })

  if (!item) return apiError('Item not found', 404)
  if (item.userId === user.userId) return apiError('You cannot claim your own item', 400)
  if (item.claim) return apiError('This item has already been claimed', 409)

  // Verify both users are in the same group
  const isMember = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: item.groupId, userId: user.userId } },
  })
  if (!isMember) return apiError('Not a member of this group', 403)

  const claim = await prisma.claim.create({
    data: {
      wishlistItemId,
      claimedByUserId: user.userId,
      pledgeAmount: pledgeAmount ? parseFloat(pledgeAmount) : null,
    },
  })

  return apiSuccess({ claim }, 201)
}

// DELETE - unclaim an item
export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const wishlistItemId = searchParams.get('wishlistItemId')
  if (!wishlistItemId) return apiError('wishlistItemId required')

  const claim = await prisma.claim.findFirst({
    where: { wishlistItemId, claimedByUserId: user.userId },
  })

  if (!claim) return apiError('Claim not found', 404)

  await prisma.claim.delete({ where: { id: claim.id } })
  return apiSuccess({ success: true })
}

// GET - get all items claimed by me
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const claims = await prisma.claim.findMany({
    where: { claimedByUserId: user.userId },
    include: {
      wishlistItem: {
        include: {
          user: { select: { id: true, displayName: true } },
          group: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return apiSuccess({ claims })
}
