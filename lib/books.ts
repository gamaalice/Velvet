import { BookStatus } from '../generated/prisma/client'

import { prisma } from '@/lib/prisma'

export type BookStatusValue =
  | 'LIDO'
  | 'LENDO'
  | 'QUERO_LER'

export type BookInput = {
  title?: string | null
  author?: string | null
  status: BookStatusValue
  year?: number | null
  rating?: number | null
  review?: string | null
  finishedAt?: string | null
  genres?: string[]
}

function normalizeGenres(genres: string[] = []) {
  return [
    ...new Set(
      genres
        .map((genre) => genre.trim())
        .filter(Boolean),
    ),
  ]
}

function normalizeText(value?: string | null) {
  return value?.trim() || null
}

function validateBookInput(input: BookInput) {
  if (
    !['LIDO', 'LENDO', 'QUERO_LER'].includes(
      input.status,
    )
  ) {
    throw new Error('Status inválido.')
  }

  if (input.year !== undefined && input.year !== null) {
    if (
      !Number.isInteger(input.year) ||
      input.year < 0 ||
      input.year > 9999
    ) {
      throw new Error('Ano inválido.')
    }
  }

  if (input.rating !== undefined && input.rating !== null) {
    if (
      !Number.isInteger(input.rating) ||
      input.rating < 0 ||
      input.rating > 5
    ) {
      throw new Error(
        'A avaliação deve estar entre 0 e 5.',
      )
    }
  }

  if (
    input.finishedAt !== undefined &&
    input.finishedAt !== null
  ) {
    const date = new Date(input.finishedAt)

    if (Number.isNaN(date.getTime())) {
      throw new Error('Data inválida.')
    }
  }
}

export async function getBooksByUser(
  userId: string,
) {
  const books = await prisma.book.findMany({
    where: {
      userId,
    },

    include: {
      genres: {
        orderBy: {
          name: 'asc',
        },
      },
    },

    orderBy: [
      {
        updatedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  return books.map((book) => ({
    ...book,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
    finishedAt:
      book.finishedAt?.toISOString() ?? null,
  }))
}

export async function createBook(
  userId: string,
  input: BookInput,
) {
  validateBookInput(input)

  const genres = normalizeGenres(input.genres)

  const shouldHaveFinishedData =
    input.status === 'LIDO'

  const book = await prisma.book.create({
    data: {
      userId,

      title: normalizeText(input.title) ?? '',

      author: normalizeText(input.author) ?? '',

      status: input.status as BookStatus,

      year: input.year ?? null,

      rating: shouldHaveFinishedData
        ? input.rating ?? null
        : null,

      review: shouldHaveFinishedData
        ? normalizeText(input.review)
        : null,

      finishedAt:
        shouldHaveFinishedData &&
        input.finishedAt
          ? new Date(input.finishedAt)
          : null,

      genres: {
        connectOrCreate: genres.map((name) => ({
          where: {
            name,
          },

          create: {
            name,
          },
        })),
      },
    },

    include: {
      genres: true,
    },
  })

  return {
    ...book,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
    finishedAt:
      book.finishedAt?.toISOString() ?? null,
  }
}

export async function updateBook(
  userId: string,
  bookId: string,
  input: BookInput,
) {
  validateBookInput(input)

  const genres = normalizeGenres(input.genres)

  const shouldHaveFinishedData =
    input.status === 'LIDO'

  const existing = await prisma.book.findFirst({
    where: {
      id: bookId,
      userId,
    },
  })

  if (!existing) {
    throw new Error('Livro não encontrado.')
  }

  const book = await prisma.book.update({
    where: {
      id: bookId,
    },

    data: {
      title: normalizeText(input.title) ?? '',

      author: normalizeText(input.author) ?? '',

      status: input.status as BookStatus,

      year: input.year ?? null,

      rating: shouldHaveFinishedData
        ? input.rating ?? null
        : null,

      review: shouldHaveFinishedData
        ? normalizeText(input.review)
        : null,

      finishedAt:
        shouldHaveFinishedData &&
        input.finishedAt
          ? new Date(input.finishedAt)
          : null,

      genres: {
        set: [],

        connectOrCreate: genres.map((name) => ({
          where: {
            name,
          },

          create: {
            name,
          },
        })),
      },
    },

    include: {
      genres: true,
    },
  })

  return {
    ...book,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
    finishedAt:
      book.finishedAt?.toISOString() ?? null,
  }
}

export async function deleteBook(
  userId: string,
  bookId: string,
) {
  const existing = await prisma.book.findFirst({
    where: {
      id: bookId,
      userId,
    },
  })

  if (!existing) {
    throw new Error('Livro não encontrado.')
  }

  await prisma.book.delete({
    where: {
      id: bookId,
    },
  })
}