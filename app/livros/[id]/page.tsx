import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Pencil,
  Star,
} from 'lucide-react'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DeleteBookButton } from '../../../components/ui/delete-book-button'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

async function getBook(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const book = await prisma.book.findFirst({
    where: {
      id,
      userId: session.user.id,
      status: 'LIDO',
    },
    include: {
      genres: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  })

  if (!book) {
    notFound()
  }

  return book
}

function formatDate(date: Date | null) {
  if (!date) {
    return 'Não informado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default async function BookDetailsPage({
  params,
}: PageProps) {
  const { id } = await params
  const book = await getBook(id)

  const rating = book.rating ?? 0

  return (
    <main className="book-detail-page">
      <div className="book-detail-shell">
        <header className="book-detail-header">
          <Link
            href="/"
            className="book-detail-back"
          >
            <ArrowLeft size={17} />
            <span>Voltar para estante</span>
          </Link>

          <span className="book-detail-label">
            livro lido
          </span>
        </header>

        <section className="book-detail-card">
          <div className="book-detail-cover">
            <div className="book-detail-cover-inner">
              <BookOpen size={34} strokeWidth={1.5} />

              <span>
                {book.title || 'Sem título'}
              </span>
            </div>
          </div>

          <div className="book-detail-content">
            <div className="book-detail-main">
              <span className="book-detail-kicker">
                sua leitura
              </span>

              <h1>
                {book.title || 'Sem título'}
              </h1>

              <p className="book-detail-author">
                {book.author || 'Autor não informado'}
              </p>

              <div className="book-detail-meta">
                <div className="book-detail-meta-item">
                  <span>Ano</span>
                  <strong>
                    {book.year ?? 'Não informado'}
                  </strong>
                </div>

                <div className="book-detail-meta-item">
                  <span>Gênero</span>
                  <strong>
                    {book.genres.length > 0
                      ? book.genres
                          .map((genre) => genre.name)
                          .join(', ')
                      : 'Não informado'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="book-detail-rating">
              <span className="book-detail-section-label">
                nota
              </span>

              <div className="book-detail-stars">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <Star
                      key={index}
                      size={24}
                      fill={
                        index < rating
                          ? 'currentColor'
                          : 'none'
                      }
                      strokeWidth={1.5}
                    />
                  ),
                )}
              </div>

              <span className="book-detail-rating-value">
                {book.rating !== null
                  ? `${book.rating}/5`
                  : 'Sem nota'}
              </span>
            </div>
          </div>
        </section>

        <section className="book-detail-review">
          <div className="book-detail-review-header">
            <span className="book-detail-section-label">
              resenha
            </span>

            <span className="book-detail-review-mark">
              sua opinião
            </span>
          </div>

          <div className="book-detail-review-body">
            {book.review ? (
              <p>{book.review}</p>
            ) : (
              <p className="book-detail-empty">
                Você não escreveu uma resenha para este
                livro.
              </p>
            )}
          </div>
        </section>

        <section className="book-detail-reading">
          <div className="book-detail-reading-title">
            <BookOpen size={19} />
            <span>informações da leitura</span>
          </div>

          <div className="book-detail-reading-grid">
            <div className="book-detail-reading-item">
              <CalendarDays size={17} />

              <div>
                <span>Leitura finalizada</span>
                <strong>
                  {formatDate(book.finishedAt)}
                </strong>
              </div>
            </div>

            <div className="book-detail-reading-item">
              <Star size={17} />

              <div>
                <span>Avaliação</span>
                <strong>
                  {book.rating !== null
                    ? `${book.rating} de 5 estrelas`
                    : 'Sem avaliação'}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="book-detail-actions">
          <Link
            href={`/?edit=${book.id}`}
            className="book-detail-action book-detail-action-edit"
          >
            <Pencil size={17} />
            <span>Editar livro</span>
          </Link>

          <DeleteBookButton
            bookId={book.id}
            bookTitle={book.title}
          />
        </section>

        <footer className="book-detail-footer">
          <Link href="/">
            <ArrowLeft size={15} />
            voltar para a estante
          </Link>
        </footer>
      </div>
    </main>
  )
}