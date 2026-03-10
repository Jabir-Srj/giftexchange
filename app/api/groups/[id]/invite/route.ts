import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/api'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req)
  if (!user) return apiError('Unauthorized', 401)

  const { email } = await req.json()
  if (!email?.trim()) return apiError('Email is required')

  const group = await prisma.group.findUnique({ where: { id: params.id } })
  if (!group) return apiError('Group not found', 404)
  if (group.ownerId !== user.userId) return apiError('Only the group owner can send invites', 403)

  // Check if already a member
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    const alreadyMember = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: params.id, userId: existingUser.id } },
    })
    if (alreadyMember) return apiError('This person is already in the group', 409)
  }

  // Check for existing pending invite
  const existingInvite = await prisma.groupInvite.findFirst({
    where: { groupId: params.id, email, accepted: false },
  })
  if (existingInvite) return apiError('An invite has already been sent to this email', 409)

  const token = crypto.randomUUID()
  const invite = await prisma.groupInvite.create({
    data: { groupId: params.id, email, token },
  })

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`

  return apiSuccess({ invite, inviteUrl }, 201)
}
