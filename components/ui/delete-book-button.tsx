'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

type Props = {
  bookId: string
  bookTitle: string
}

export function DeleteBookButton({
  bookId,
  bookTitle,
}: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      `Excluir "${bookTitle || 'este livro'}" da sua estante?`,
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      const response = await fetch(
        `/api/books/${bookId}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        window.alert(
          'Não foi possível excluir o livro. Tente novamente.',
        )
        return
      }

      router.push('/')
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      type="button"
      className="book-detail-action book-detail-action-delete"
      onClick={handleDelete}
      disabled={deleting}
    >
      <Trash2 size={17} />
      <span>
        {deleting ? 'excluindo...' : 'Excluir livro'}
      </span>
    </button>
  )
}