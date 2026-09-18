import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import {
  createBook,
  getBooksByUser,
  type BookInput,
} from '@/lib/books'

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session?.user ?? null
}

export async function GET() {
  const user = await getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Não autenticado.' },
      { status: 401 },
    )
  }

  const books = await getBooksByUser(user.id)

  return NextResponse.json(books)
}

export async function POST(request: Request) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Não autenticado.' },
      { status: 401 },
    )
  }

  try {
    const body = (await request.json()) as BookInput

    const book = await createBook(user.id, body)

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Não foi possível criar o livro.'

    return NextResponse.json(
      { error: message },
      { status: 400 },
    )
  }
}