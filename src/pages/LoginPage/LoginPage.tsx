import { useState } from 'react'
import { Eye, EyeOff, Wrench } from 'lucide-react'
import './LoginPage.scss'
import { useAuth } from '../../contexts/AuthContext/useAuth';
import { useLocation, useNavigate } from 'react-router';
import type { LoginLocationState } from '../../types/auth';

function LoginPage() {

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;

  const from = state?.from;

  const redirectTo =
    from?.pathname?.startsWith("/") && !from.pathname.startsWith("//")
        ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
        : "/";

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)
    setError('')

    try {
        await login({ email, password });
        navigate(redirectTo, {replace: true});
    } catch (error) {
        setError(
            error instanceof Error ? error.message : "Ocorreu um erro inesperado ao entrar.",
        )
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-card__header">
          <div className="login-card__logo">
            <Wrench size={24} strokeWidth={2} />
          </div>

          <h1>GarageFlow</h1>
          <p>Gestão de oficina, simplificada.</p>
        </header>

        <div className="login-card__intro">
          <h2>Bem-vindo de volta</h2>
          <p>Entre com seus dados para acessar sua conta.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-form__field">
            <label htmlFor="password">Senha</label>

            <div className="login-form__password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                className="login-form__toggle-password"
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="login-form__error" role="alert">
                {error}
            </p>
          )}

          <button className="login-form__submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <footer className="login-card__footer">
          <p>GarageFlow · Gestão inteligente para sua oficina</p>
        </footer>
      </section>
    </main>
  )
}

export default LoginPage