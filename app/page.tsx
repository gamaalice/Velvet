import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { LibraryShell } from '@/components/library-shell'
import { auth } from '@/lib/auth'
import { getBooksByUser } from '@/lib/books'

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const books = await getBooksByUser(session.user.id)

  return (
    <LibraryShell
      userName={session.user.name || session.user.email}
      initialBooks={books}
    />
  )
}