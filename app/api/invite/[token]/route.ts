import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Please sign in to accept this invite', 401)

  const invite = await prisma.groupInvite.findUnique({ where: { token: params.token } })
  if (!invite) return apiError('Invalid or expired invite link', 404)
  if (invite.accepted) return apiError('This invite has already been used', 409)

  // Add user to group
  const existing = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: invite.groupId, userId: user.userId } },
  })

  if (!existing) {
    await prisma.groupMember.create({
      data: { groupId: invite.groupId, userId: user.userId },
    })
  }

  await prisma.groupInvite.update({ where: { id: invite.id }, data: { accepted: true } })

  return apiSuccess({ groupId: invite.groupId })
}

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const invite = await prisma.groupInvite.findUnique({
    where: { token: params.token },
    include: { group: { select: { id: true, name: true, description: true } } },
  })

  if (!invite) return apiError('Invalid invite link', 404)

  return apiSuccess({ invite })
}
