'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type Props = { mode: 'sign-in' | 'sign-up' }

export function AuthForm({ mode }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password })
    if (result.error) setError('Não foi possível entrar. Confira seus dados e tente novamente.')
    else { router.push('/'); router.refresh() }
    setLoading(false)
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {isSignUp && <label>Como quer ser chamado<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" required /></label>}
      <label>E-mail<div className="input-with-icon"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" required /></div></label>
      <label>Senha<div className="input-with-icon"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
      {error && <p className="auth-error">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Entrando...' : isSignUp ? 'Criar minha conta' : 'Entrar na biblioteca'} <ArrowRight size={17} /></button>
    </form>
  )
}
