'use client'

import Image from 'next/image'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const result = await authClient.signUp.email({
      name,
      email,
      password,
    })

    if (result.error) {
      setError('Não foi possível criar sua conta. Tente novamente.')
      setLoading(false)
      return
    }

    window.location.href = '/'
  }

  return (
    <main className="login-page">
      <section className="login-art-panel">
        <div className="login-art-background" aria-hidden="true">
          <span className="login-star login-star-one" />
          <span className="login-star login-star-two" />
          <span className="login-star login-star-three" />
          <span className="login-heart" />
        </div>

        <div className="login-brand">
          <Image
            src="/icon/name_logo.png"
            alt="Velvet"
            width={180}
            height={62}
            className="login-brand-image"
            priority
          />
        </div>

        <div
          className={`login-character ${
            passwordFocused ? 'is-hiding' : ''
          }`}
          aria-hidden="true"
        >
          <Image
            src="/cat_book.png"
            alt=""
            width={420}
            height={420}
            className="login-character-image"
            priority
          />
        </div>

        <div className="login-art-copy">
          <span>comece por uma história</span>

          <h1>
            Monte
            <br />
            sua <em>estante.</em>
          </h1>

          <p>
            Crie sua conta e guarde suas histórias, acompanhe
            suas leituras e deixe cada livro encontrar seu espaço.
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="login-mobile-brand">
            <Image
              src="/icon/name_logo.png"
              alt="Velvet"
              width={165}
              height={57}
              className="login-mobile-brand-image"
            />
          </div>

          <div className="login-heading">
            <span className="login-eyebrow">
              um espaço só seu
            </span>

            <h2>
              Crie sua
              <br />
              biblioteca.
            </h2>

            <p>Comece a organizar suas leituras agora.</p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <label className="login-field">
              <span>Nome</span>

              <div className="login-input-wrapper">
                <User size={17} />

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="seu nome"
                  autoComplete="name"
                />
              </div>
            </label>

            <label className="login-field">
              <span>E-mail</span>

              <div className="login-input-wrapper">
                <Mail size={17} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="login-field">
              <span>Senha</span>

              <div className="login-input-wrapper">
                <LockKeyhole size={17} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? 'Ocultar senha'
                      : 'Mostrar senha'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>

            <label className="login-field">
              <span>Confirmar senha</span>

              <div className="login-input-wrapper">
                <LockKeyhole size={17} />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </label>

            <div className="login-note">
              <ShieldAlert size={15} />
              <span>
                Salve seu login e senha em um lugar seguro —
                você vai precisar deles para entrar depois.
              </span>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>
                {loading ? 'criando conta...' : 'criar conta'}
              </span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="login-divider">
            <span />
            <small>ou</small>
            <span />
          </div>

          <p className="login-register">
            Já tem uma conta?{' '}
            <a href="/sign-in">
              entrar na minha conta
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}