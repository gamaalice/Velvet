'use client'

import {
  BookOpen,
  ChevronDown,
  CirclePlus,
  Heart,
  Search,
  Star,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SiGithub } from '@icons-pack/react-simple-icons'
import { FaLinkedinIn } from 'react-icons/fa6'
import { authClient } from '@/lib/auth-client'

type Status = 'LIDO' | 'LENDO' | 'QUERO_LER'

type Genre = {
  id: string
  name: string
}

type Book = {
  id: string
  title: string
  author: string
  status: Status
  year: number | null
  rating: number | null
  review: string | null
  finishedAt: string | null
  createdAt: string
  updatedAt: string
  genres: Genre[]
}

type Props = {
  userName: string
  initialBooks: Book[]
}

const statusLabel: Record<Status, string> = {
  LIDO: 'Lidos',
  LENDO: 'Lendo',
  QUERO_LER: 'Quero ler',
}

const statusDescription: Record<Status, string> = {
  LIDO: 'histórias que já ficaram com você',
  LENDO: 'a história acontecendo agora',
  QUERO_LER: 'histórias esperando sua vez',
}

const coverClasses = [
  'book-cover-rose',
  'book-cover-green',
  'book-cover-blue',
  'book-cover-lilac',
  'book-cover-sand',
  'book-cover-wine',
]


const CAT_IMAGE_LOGO = '/icon/logo.png'
const CAT_IMAGE_PROFILE = '/icon/logo.png'
const CAT_IMAGE_HERO = '/cat_window.png'
const CAT_IMAGE_FOOTER = '/cat_book_heart.png'
const CAT_IMAGE_LOGO_SIZE = '50px'
const CAT_IMAGE_PROFILE_SIZE = '25px'
const CAT_IMAGE_HERO_SIZE = '900px'
const CAT_IMAGE_FOOTER_SIZE = '100px'

function getInitials(title: string) {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (!words.length) return 'LV'

  return words
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function getBookCoverClass(index: number) {
  return coverClasses[index % coverClasses.length]
}

export function LibraryShell({
  userName,
  initialBooks,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [books, setBooks] = useState(initialBooks)
  const [search, setSearch] = useState('')
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')
  const [genres, setGenres] = useState('')
  const [status, setStatus] =
    useState<Status>('QUERO_LER')
  const [rating, setRating] = useState('')
  const [review, setReview] = useState('')
  const [finishedAt, setFinishedAt] = useState('')

  useEffect(() => {
    const editId = searchParams.get('edit')

    if (!editId) return

    const book = books.find((item) => item.id === editId)

    if (!book) return

    openEdit(book)
    router.replace('/#estante')
  }, [searchParams, books, router])

  const firstName =
    userName.trim().split(/\s+/)[0] || 'leitora'

  const counts = useMemo(
    () => ({
      LIDO: books.filter(
        (book) => book.status === 'LIDO',
      ).length,

      LENDO: books.filter(
        (book) => book.status === 'LENDO',
      ).length,

      QUERO_LER: books.filter(
        (book) => book.status === 'QUERO_LER',
      ).length,
    }),
    [books],
  )

  const filteredBooks = useMemo(() => {
    const normalized = search.trim().toLowerCase()

    if (!normalized) return books

    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(normalized) ||
        book.author.toLowerCase().includes(normalized) ||
        book.genres.some((genre) =>
          genre.name.toLowerCase().includes(normalized),
        )
      )
    })
  }, [books, search])

  function resetForm() {
    setEditingBook(null)
    setTitle('')
    setAuthor('')
    setYear('')
    setGenres('')
    setStatus('QUERO_LER')
    setRating('')
    setReview('')
    setFinishedAt('')
  }

  function closeModal() {
    setModalOpen(false)
    resetForm()
  }

  function openCreate() {
    resetForm()
    setModalOpen(true)
  }

  function openEdit(book: Book) {
    setEditingBook(book)
    setTitle(book.title)
    setAuthor(book.author)
    setYear(book.year?.toString() ?? '')
    setGenres(
      book.genres
        .map((genre) => genre.name)
        .join(', '),
    )
    setStatus(book.status)
    setRating(book.rating?.toString() ?? '')
    setReview(book.review ?? '')
    setFinishedAt(
      book.finishedAt ? book.finishedAt.slice(0, 10) : '',
    )
    setModalOpen(true)
  }

  function handleBookClick(book: Book) {
    if (book.status === 'LIDO') {
      router.push(`/livros/${book.id}`)
      return
    }

    openEdit(book)
  }

  function handleStatusChange(newStatus: Status) {
    setStatus(newStatus)

    // ao marcar como lido, sugere a data de hoje se ainda não houver uma
    if (newStatus === 'LIDO' && !finishedAt) {
      setFinishedAt(new Date().toISOString().slice(0, 10))
    }
  }

  async function saveBook(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setSaving(true)

    const payload = {
      title,
      author,
      status,
      year: year ? Number(year) : null,
      rating:
        status === 'LIDO' && rating
          ? Number(rating)
          : null,
      review:
        status === 'LIDO' && review.trim()
          ? review
          : null,
      finishedAt:
        status === 'LIDO' && finishedAt
          ? new Date(finishedAt).toISOString()
          : null,
      genres: genres
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    const endpoint = editingBook
      ? `/api/books/${editingBook.id}`
      : '/api/books'

    try {
      const response = await fetch(endpoint, {
        method: editingBook ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)

        console.error(
          'Erro ao salvar livro:',
          body,
        )

        return
      }

      const saved: Book = await response.json()

      setBooks((current) =>
        editingBook
          ? current.map((book) =>
              book.id === saved.id ? saved : book,
            )
          : [saved, ...current],
      )

      resetForm()
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function removeBook(book: Book) {
    const confirmed = window.confirm(
      `Excluir "${book.title || 'este livro'}" da sua estante?`,
    )

    if (!confirmed) return

    const response = await fetch(
      `/api/books/${book.id}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) return

    setBooks((current) =>
      current.filter(
        (item) => item.id !== book.id,
      ),
    )

    if (editingBook?.id === book.id) {
      resetForm()
      setModalOpen(false)
    }
  }

  async function handleLogout() {
    await authClient.signOut()
    window.location.href = '/sign-in'
  }

  function renderShelf(
    shelfStatus: Status,
    shelfBooks: Book[],
  ) {
    return (
      <div
        className={`velvet-shelf-group shelf-${shelfStatus.toLowerCase()}`}
      >
        <div className="velvet-shelf-label">
          <div className="shelf-label-icon">
            {shelfStatus === 'LIDO' ? (
              <Heart size={19} />
            ) : shelfStatus === 'LENDO' ? (
              <BookOpen size={19} />
            ) : (
              <span className="shelf-cat-mark">
                ◌
              </span>
            )}
          </div>

          <div>
            <strong>
              {statusLabel[shelfStatus]}
            </strong>

            <small>
              {statusDescription[shelfStatus]}
            </small>
          </div>

          <span className="shelf-count">
            {shelfBooks.length}
          </span>
        </div>

        <div className="velvet-shelf">
          <div className="shelf-books">
            {shelfBooks.length > 0 ? (
              shelfBooks.map((book, index) => (
                <button
                  type="button"
                  className="shelf-book"
                  key={book.id}
                  onClick={() =>
                    handleBookClick(book)
                  }
                  aria-label={
                    book.status === 'LIDO'
                      ? `Abrir ${book.title}`
                      : `Editar ${book.title}`
                  }
                >
                  <span
                    className={`book-cover ${getBookCoverClass(
                      index,
                    )}`}
                  >
                    <span className="book-cover-decoration">
                      {book.status === 'LIDO'
                        ? '♡'
                        : index % 2 === 0
                          ? '✦'
                          : '·'}
                    </span>

                    <span className="book-cover-title">
                      {book.title || 'sem título'}
                    </span>

                    <span className="book-cover-author">
                      {book.author || 'sem autor'}
                    </span>

                    <span className="book-cover-initials">
                      {getInitials(book.title)}
                    </span>
                  </span>

                  <span className="book-spine">
                    {book.title || 'livro'}
                  </span>
                </button>
              ))
            ) : (
              <button
                type="button"
                className="empty-shelf"
                onClick={openCreate}
              >
                <CirclePlus size={23} />

                <span>
                  adicionar uma história
                </span>
              </button>
            )}
          </div>

          <div className="wooden-shelf" />
        </div>
      </div>
    )
  }

  return (
    <main className="velvet-page">
      <header className="velvet-header">
        <a
          href="#inicio"
          className="velvet-logo"
          aria-label="Velvet - início"
        >
          <span className="velvet-image-slot">
            <img
              src={CAT_IMAGE_LOGO}
              alt="Logo da Velvet"
              className="cat-image cat-image-logo"
              style={{
                width: CAT_IMAGE_LOGO_SIZE,
                height: CAT_IMAGE_LOGO_SIZE,
                objectFit: 'contain',
              }}
            />
          </span>

          <span>Velvet</span>
        </a>

      

        <div className="velvet-header-actions">
          <label className="header-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="buscar"
              aria-label="Buscar livros"
            />
          </label>

          <button
            type="button"
            className="profile-button"
            onClick={handleLogout}
            aria-label="Sair"
            title="Sair"
          >
            <span className="velvet-image-slot">
              <img
                src={CAT_IMAGE_PROFILE}
                alt=""
                className="cat-image cat-image-profile"
                style={{
                  width: CAT_IMAGE_PROFILE_SIZE,
                  height: CAT_IMAGE_PROFILE_SIZE,
                  objectFit: 'contain',
                }}
              />
            </span>
          </button>

          <ChevronDown
            size={15}
            className="profile-chevron"
          />
        </div>
      </header>

      <section
        id="inicio"
        className="velvet-hero"
      >
        <div className="hero-wave hero-wave-one" />
        <div className="hero-wave hero-wave-two" />

        <div className="hero-copy">
          <span className="hero-eyebrow">
            sua biblioteca pessoal
          </span>

          <div className="hero-title-line">
            <span />
            <Heart size={15} />
          </div>

          <h1>
            Organize suas leituras
            <br />
            com apenas
            <br />
            um <em>clique.</em>
          </h1>

          <p>
            Organize suas leituras, descubra novas
            histórias e cuide da sua estante. Aqui,
            cada livro tem um espaço especial.
          </p>

          <button
            type="button"
            className="hero-button"
            onClick={openCreate}
          >
            <CirclePlus size={20} />
            Adicionar livro
          </button>
        </div>

        <div className="hero-illustration velvet-image-slot">
          <img
            src={CAT_IMAGE_HERO}
            alt="Ilustração de gato da Velvet"
            className="cat-image cat-image-hero"
            style={{
              width: CAT_IMAGE_HERO_SIZE,
              height: CAT_IMAGE_HERO_SIZE,
              objectFit: 'contain',
            }}
          />
        </div>
      </section>

      <section
        id="estante"
        className="velvet-library-section"
      >
        <div className="library-heading">
          <div className="library-heading-copy">
            <span className="section-eyebrow">
              sua estante
            </span>

            <div className="section-decoration">
              <span />
              <Heart size={15} />
              <span />
            </div>

            <h2>
              Seus livros,
              <br />
              do seu jeito.
            </h2>

            <p>
              Clique em um livro para ver
              mais detalhes.
            </p>
          </div>

          <div className="status-pills">
            <a
              href="#shelf-quero"
              className="status-pill"
            >
              <span className="pill-icon">
                <CirclePlus size={19} />
              </span>

              Quero ler

              <strong>
                {counts.QUERO_LER}
              </strong>
            </a>

            <a
              href="#shelf-lendo"
              className="status-pill"
            >
              <BookOpen size={19} />

              Lendo

              <strong>
                {counts.LENDO}
              </strong>
            </a>

            <a
              href="#shelf-lido"
              className="status-pill active"
            >
              <Heart size={19} />

              Lidos

              <strong>
                {counts.LIDO}
              </strong>
            </a>
          </div>
        </div>

        <div className="shelves-wrapper">
          <div id="shelf-lido">
            {renderShelf(
              'LIDO',
              filteredBooks.filter(
                (book) =>
                  book.status === 'LIDO',
              ),
            )}
          </div>

          <div id="shelf-lendo">
            {renderShelf(
              'LENDO',
              filteredBooks.filter(
                (book) =>
                  book.status === 'LENDO',
              ),
            )}
          </div>

          <div id="shelf-quero">
            {renderShelf(
              'QUERO_LER',
              filteredBooks.filter(
                (book) =>
                  book.status === 'QUERO_LER',
              ),
            )}
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="book-modal-backdrop"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="book-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-modal-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="book-modal-close"
              onClick={closeModal}
              aria-label="Fechar formulário"
            >
              <X size={19} />
            </button>

            <div className="book-modal-header">
              <span className="section-eyebrow">
                {editingBook
                  ? 'editar livro'
                  : 'adicionar livro'}
              </span>

              <div className="section-decoration">
                <span />
                <Heart size={15} />
                <span />
              </div>

              <h2 id="book-modal-title">
                {editingBook ? (
                  <>
                    Continue a história
                    <br />
                    do seu jeito.
                  </>
                ) : (
                  <>
                    Qual livro você
                    <br />
                    quer registrar?
                  </>
                )}
              </h2>

              <p>
                {editingBook
                  ? 'Atualize as informações da sua leitura.'
                  : 'Adicione um livro à sua biblioteca.'}
              </p>
            </div>

            <form
              className="velvet-book-form"
              onSubmit={saveBook}
            >
              <div className="form-tabs">
                <span
                  className={
                    !editingBook
                      ? 'active'
                      : ''
                  }
                >
                  Adicionar livro
                </span>

                <span
                  className={
                    editingBook
                      ? 'active'
                      : ''
                  }
                >
                  {editingBook
                    ? 'Editar livro'
                    : 'Sua estante'}
                </span>
              </div>

              <div className="form-grid">
                <label className="velvet-field">
                  <span>Título</span>

                  <input
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value,
                      )
                    }
                    placeholder="Nome do livro"
                  />
                </label>

                <label className="velvet-field">
                  <span>Autor</span>

                  <input
                    value={author}
                    onChange={(event) =>
                      setAuthor(
                        event.target.value,
                      )
                    }
                    placeholder="Nome do autor"
                  />
                </label>

                <label className="velvet-field">
                  <span>Ano de leitura</span>

                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={year}
                    onChange={(event) =>
                      setYear(
                        event.target.value,
                      )
                    }
                    placeholder="Ex.: 2026"
                  />
                </label>

                <label className="velvet-field">
                  <span>Gênero</span>

                  <input
                    value={genres}
                    onChange={(event) =>
                      setGenres(
                        event.target.value,
                      )
                    }
                    placeholder="Ex.: Ficção, Romance..."
                  />
                </label>

                <label className="velvet-field">
                  <span>Status</span>

                  <div className="select-wrapper">
                    <select
                      value={status}
                      onChange={(event) =>
                        handleStatusChange(
                          event.target
                            .value as Status,
                        )
                      }
                    >
                      <option value="QUERO_LER">
                        Quero ler
                      </option>

                      <option value="LENDO">
                        Lendo
                      </option>

                      <option value="LIDO">
                        Lido
                      </option>
                    </select>

                    <ChevronDown size={16} />
                  </div>
                </label>

                {status === 'LIDO' && (
                  <label className="velvet-field">
                    <span>Leitura finalizada</span>

                    <input
                      type="date"
                      value={finishedAt}
                      onChange={(event) =>
                        setFinishedAt(
                          event.target.value,
                        )
                      }
                    />
                  </label>
                )}

                {status === 'LIDO' && (
                  <div className="velvet-field">
                    <span>Nota</span>

                    <div className="star-rating">
                      {Array.from(
                        { length: 5 },
                        (_, index) => {
                          const value =
                            index + 1

                          const active =
                            Number(rating) >=
                            value

                          return (
                            <button
                              type="button"
                              key={value}
                              className={
                                active
                                  ? 'active'
                                  : ''
                              }
                              onClick={() =>
                                setRating(
                                  Number(
                                    rating,
                                  ) === value
                                    ? '0'
                                    : String(
                                        value,
                                      ),
                                )
                              }
                              aria-label={`${value} estrelas`}
                            >
                              <Star
                                size={22}
                                fill={
                                  active
                                    ? 'currentColor'
                                    : 'none'
                                }
                              />
                            </button>
                          )
                        },
                      )}
                    </div>
                  </div>
                )}

                {status === 'LIDO' && (
                  <label className="velvet-field full">
                    <span>Resenha</span>

                    <textarea
                      value={review}
                      onChange={(event) =>
                        setReview(
                          event.target.value,
                        )
                      }
                      placeholder="Escreva o que achou do livro..."
                    />
                  </label>
                )}
              </div>

              <div className="form-actions">
                {editingBook && (
                  <button
                    type="button"
                    className="secondary-form-button danger"
                    onClick={() =>
                      removeBook(editingBook)
                    }
                  >
                    excluir livro
                  </button>
                )}

                {editingBook && (
                  <button
                    type="button"
                    className="secondary-form-button"
                    onClick={closeModal}
                  >
                    cancelar
                  </button>
                )}

                <button
                  type="submit"
                  className="save-book-button"
                  disabled={saving}
                >
                  <CirclePlus size={18} />

                  {saving
                    ? 'salvando...'
                    : editingBook
                      ? 'Salvar alterações'
                      : 'Salvar livro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      

      <footer className="velvet-footer">
        <div className="footer-brand-block">
          <div className="footer-logo">
            <span className="velvet-image-slot">
              <img
                src={CAT_IMAGE_FOOTER}
                alt=""
                className="cat-image cat-image-footer"
                style={{
                  width: CAT_IMAGE_FOOTER_SIZE,
                  height: CAT_IMAGE_FOOTER_SIZE,
                  objectFit: 'contain',
                }}
              />
            </span>

            <strong>Velvet</strong>
          </div>

          <small>
            Sua leitura organizada.
          </small>
        </div>

        <div className="footer-credit">
          <span>
            Feito por
          </span>

          <strong>
            Alice Gama
          </strong>

         
        </div>

        <div className="footer-social">
          <a
            href="https://github.com/gamaalice"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <SiGithub size={18} />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/alice-gama-75913022a/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={17} />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="footer-stack">
          <span />
          <span />
          <span />
        </div>
      </footer>
    </main>
  )
}