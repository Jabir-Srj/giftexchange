import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

// GET /api/wishlist?groupId=xxx  - get items for a group (with claim visibility rules)
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')
  if (!groupId) return apiError('groupId required')

  const isMember = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.userId } },
  })
  if (!isMember) return apiError('Not a member of this group', 403)

  const items = await prisma.wishlistItem.findMany({
    where: { groupId },
    include: {
      user: { select: { id: true, displayName: true } },
      claim: { include: { claimedBy: { select: { id: true, displayName: true } } } },
    },
    orderBy: { user: { displayName: 'asc' } },
  })

  // Hide who claimed from the item owner
  const sanitized = items.map(item => ({
    ...item,
    claim: item.userId === user.userId
      ? item.claim ? { claimed: true, pledgeAmount: item.claim.pledgeAmount } : null
      : item.claim,
  }))

  return apiSuccess({ items: sanitized })
}

// POST - add wishlist item
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const { groupId, title, description, url, price } = await req.json()
  if (!groupId || !title?.trim()) return apiError('groupId and title are required')

  const isMember = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.userId } },
  })
  if (!isMember) return apiError('Not a member of this group', 403)

  const item = await prisma.wishlistItem.create({
    data: {
      userId: user.userId,
      groupId,
      title: title.trim(),
      description: description?.trim() || null,
      url: url?.trim() || null,
      price: price ? parseFloat(price) : null,
    },
  })

  return apiSuccess({ item }, 201)
}

// DELETE - remove item (own items only)
export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return apiError('id required')

  const item = await prisma.wishlistItem.findUnique({ where: { id } })
  if (!item) return apiError('Item not found', 404)
  if (item.userId !== user.userId) return apiError('You can only remove your own items', 403)

  await prisma.wishlistItem.delete({ where: { id } })
  return apiSuccess({ success: true })
}
