import { useEffect, useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "../firebase.config";

function friendlyError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    case "auth/network-request-failed":
      return "Falha de conexão. Verifique sua internet.";
    default:
      return "Não foi possível entrar. Tente novamente.";
  }
}

function AdminLoginModal({ adminUser, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // fecha com a tecla Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
      onClose();
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    } 
  }

  async function handleLogout() {
    await signOut(auth);
    onClose();
  }

  const inputClass =
    "w-full rounded-brand-sm border border-line bg-page px-3.5 py-2.5 font-body text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25";

  return (
    <div
      className="fixed inset-0 z-40 flex animate-fadeIn items-center justify-center bg-[#0b2822]/45 p-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[400px] animate-slideUp flex-col rounded-brand bg-surface px-7 pb-7 pt-9 shadow-brand-md"
        role="dialog"
        aria-modal="true"
        aria-label="Login de administrador"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full border-none bg-white/85 text-[15px] text-primary-dark transition hover:bg-primary-light"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>

        <div className="mb-4 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary-dark">
            <ShieldCheck className="h-6 w-6" strokeWidth={2} />
          </span>
          <h2 className="m-0 font-display text-xl text-primary-dark">
            {adminUser ? "Você está logado" : "Acesso do administrador"}
          </h2>
          {adminUser && (
            <p className="mb-0 mt-2 break-all text-sm text-muted">
              {adminUser.email}
            </p>
          )}
        </div>

        {adminUser ? (
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border-none bg-primary px-4 py-[11px] font-body text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-primary-dark"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sair
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
              E-mail
              <input
                type="email"
                required
                autoFocus
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted">
              Senha
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>

            {error && (
              <p role="alert" className="m-0 text-[13px] font-semibold text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-full border-none bg-primary px-4 py-[11px] font-body text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminLoginModal;
