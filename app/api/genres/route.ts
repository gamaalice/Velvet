import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Não autenticado.' },
      { status: 401 },
    )
  }

  const genres = await prisma.genre.findMany({
    where: {
      books: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return NextResponse.json(genres)
}