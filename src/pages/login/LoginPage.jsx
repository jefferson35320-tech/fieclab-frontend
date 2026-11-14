import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import api from "../../config/api";
import { authService } from "../../services/auth-service";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";

// traduz o erro do axios para uma mensagem amigável
function getErrorMessage(error) {
  const status = error && error.response && error.response.status;

  if (status === 401 || status === 403) return "E-mail ou senha incorretos.";
  if (status === 400) return "Confira o e-mail e a senha informados.";
  if (!error || !error.response) {
    return "Não foi possível conectar ao servidor. Tente novamente em instantes.";
  }
  return "Não foi possível entrar agora. Tente novamente.";
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logged, setLogged] = useState(authService.isAuthenticated());

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Informe o e-mail e a senha.");
      return;
    }

    setLoading(true);
    try {
      // salva o token no localStorage (feito dentro do authService.login)
      await authService.login({ email: email.trim(), password });
      navigate("/home");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // o backend cuida do fluxo do Google e volta para /oauth2/redirect com o token
  function handleGoogleLogin() {
    const base = String(api.defaults.baseURL || "").replace(/\/$/, "");
    window.location.href = `${base}/oauth2/authorization/google`;
  }

  function handleLogout() {
    authService.logout();
    setLogged(false);
  }

  const inputClass =
    "w-full rounded-[8px] border border-line bg-transparent px-3.5 py-2.5 font-body text-[15px] text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-[420px]">
        <button
          type="button"
          className="mb-5 flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-body text-sm font-semibold text-primary-dark hover:underline"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catálogo
        </button>

        <div className="rounded-brand border border-line bg-surface p-7 shadow-brand-md sm:p-8">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>

          {logged ? (
            <div className="text-center">
              <h1 className="m-0 mb-2 font-display text-2xl font-bold text-primary-dark">
                Você já está conectado
              </h1>
              <p className="m-0 mb-6 text-[15px] text-muted">
                Sua sessão está ativa neste navegador.
              </p>
              <button
                type="button"
                className="mb-3 w-full cursor-pointer rounded-full border-0 bg-primary px-5 py-3 font-body text-[15px] font-bold text-white transition hover:opacity-90"
                onClick={() => navigate("/home")}
              >
                Ir para o catálogo
              </button>
              <button
                type="button"
                className="w-full cursor-pointer rounded-full border border-line bg-transparent px-5 py-3 font-body text-[15px] font-bold text-primary-dark transition hover:bg-primary-light"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <h1 className="m-0 mb-1.5 text-center font-display text-2xl font-bold text-primary-dark">
                Entrar
              </h1>
              <p className="m-0 mb-6 text-center text-[15px] text-muted">
                Acesse sua conta para continuar.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block font-body text-[13px] font-semibold text-ink"
                >
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className={`${inputClass} mb-4`}
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label
                  htmlFor="login-password"
                  className="mb-1.5 block font-body text-[13px] font-semibold text-ink"
                >
                  Senha
                </label>
                <div className="relative mb-4">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`${inputClass} pr-11`}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-1.5 text-muted hover:text-ink"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="m-0 mb-4 rounded-[8px] bg-danger/10 px-3.5 py-2.5 text-[14px] font-semibold text-danger"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-full border-0 bg-primary px-5 py-3 font-body text-[15px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3 text-[13px] text-muted">
                <span className="h-px flex-1 bg-line" />
                ou
                <span className="h-px flex-1 bg-line" />
              </div>

              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-line bg-white px-5 py-3 font-body text-[15px] font-bold text-[#3c4043] transition hover:shadow-brand-md"
                onClick={handleGoogleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
                  <path fill="#FBBC05" d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.7l7.9-6.1z" />
                  <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                </svg>
                Continuar com o Google
              </button>

              <p className="m-0 mt-6 text-center text-[13px] text-muted">
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent p-0 font-body text-[13px] font-semibold text-primary-dark hover:underline"
                  onClick={() => navigate("/home", { state: { openAdmin: true } })}
                >
                  Acesso de administrador
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}

export default LoginPage;
