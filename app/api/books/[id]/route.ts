import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import {
  deleteBook,
  updateBook,
  type BookInput,
} from '@/lib/books'

type Context = {
  params: Promise<{
    id: string
  }>
}

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session?.user ?? null
}

export async function PUT(
  request: Request,
  context: Context,
) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Não autenticado.' },
      { status: 401 },
    )
  }

  try {
    const { id } = await context.params
    const body = (await request.json()) as BookInput

    const book = await updateBook(
      user.id,
      id,
      body,
    )

    return NextResponse.json(book)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Não foi possível atualizar o livro.'

    return NextResponse.json(
      { error: message },
      { status: 400 },
    )
  }
}

export async function DELETE(
  _request: Request,
  context: Context,
) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Não autenticado.' },
      { status: 401 },
    )
  }

  try {
    const { id } = await context.params

    await deleteBook(user.id, id)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Não foi possível excluir o livro.'

    return NextResponse.json(
      { error: message },
      { status: 400 },
    )
  }
}