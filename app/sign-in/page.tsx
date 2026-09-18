'use client'

import Image from 'next/image'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const result = await authClient.signIn.email({
      email,
      password,
    })

    if (result.error) {
      setError('E-mail ou senha incorretos.')
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
          <span>seu cantinho de leitura</span>

          <h1>
            Entre para
            <br />
            sua <em>estante.</em>
          </h1>

          <p>
            Guarde suas histórias, acompanhe suas leituras
            e deixe cada livro encontrar seu espaço.
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
              bem-vinda de volta
            </span>

            <h2>
              Entre na sua
              <br />
              biblioteca.
            </h2>

            <p>Continue de onde parou.</p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
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
                  autoComplete="current-password"
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
                {loading ? 'entrando...' : 'entrar'}
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
            Ainda não tem uma conta?{' '}
            <a href="/sign-up">
              criar minha conta
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}