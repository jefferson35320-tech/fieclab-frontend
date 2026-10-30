import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function WelcomeScreen({ onContinue }) {
  const buttonRef = useRef(null);

  // foca o botão ao abrir: dá para avançar só apertando Enter
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-screen animate-fadeIn flex-col items-center justify-center bg-page px-6 text-center">
      <Logo large />

      <h1 className="m-0 mt-10 font-display text-2xl font-bold text-primary-dark sm:text-[32px]">
        Bem-vindo ao FiecLab
      </h1>
      <p className="m-0 mb-10 mt-3 max-w-md text-[15px] text-muted">
        Produtos de higiene e limpeza para o dia a dia. Escolha seus itens,
        monte o carrinho e finalize o pedido.
      </p>

      <button
        ref={buttonRef}
        type="button"
        onClick={onContinue}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-body text-[15px] font-semibold text-white shadow-brand-md transition hover:bg-primary-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
      >
        Avançar
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <ThemeToggle />
    </div>
  );
}

export default WelcomeScreen;
