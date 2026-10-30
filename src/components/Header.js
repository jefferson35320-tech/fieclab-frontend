import {
  FlaskConical,
  TestTube,
  Atom,
  Microscope,
  Beaker,
  Pill,
  Dna,
  ShoppingCart,
} from "lucide-react";
import Logo from "./Logo";

const FLOATING_ICONS = [
  { Icon: TestTube, top: "12%", left: "6%", size: "h-8 w-8", duration: "6s", delay: "0s", opacity: "opacity-35", color: "text-primary" },
  { Icon: Atom, top: "72%", left: "10%", size: "h-9 w-9", duration: "7.5s", delay: "1.5s", opacity: "opacity-30", color: "text-star" },
  { Icon: Microscope, top: "34%", left: "16%", size: "h-10 w-10", duration: "8s", delay: "0.4s", opacity: "opacity-25", color: "text-primary" },
  { Icon: FlaskConical, top: "62%", left: "24%", size: "h-11 w-11", duration: "8s", delay: "1.2s", opacity: "opacity-30", color: "text-star" },
  { Icon: Dna, top: "16%", left: "30%", size: "h-8 w-8", duration: "7s", delay: "2.4s", opacity: "opacity-35", color: "text-primary" },
  { Icon: Pill, top: "70%", left: "36%", size: "h-8 w-8", duration: "6.5s", delay: "3s", opacity: "opacity-35", color: "text-accent" },
  { Icon: Beaker, top: "10%", left: "42%", size: "h-9 w-9", duration: "7s", delay: "2.8s", opacity: "opacity-25", color: "text-star" },
  { Icon: Atom, top: "66%", left: "48%", size: "h-12 w-12", duration: "9s", delay: "0.6s", opacity: "opacity-20", color: "text-primary" },
  { Icon: TestTube, top: "26%", left: "54%", size: "h-8 w-8", duration: "6.8s", delay: "1.9s", opacity: "opacity-30", color: "text-star" },
  { Icon: Beaker, top: "48%", left: "60%", size: "h-10 w-10", duration: "7.5s", delay: "1.8s", opacity: "opacity-30", color: "text-primary" },
  { Icon: Microscope, top: "12%", left: "66%", size: "h-9 w-9", duration: "8.2s", delay: "2.2s", opacity: "opacity-25", color: "text-star" },
  { Icon: FlaskConical, top: "72%", left: "72%", size: "h-9 w-9", duration: "8.5s", delay: "0.9s", opacity: "opacity-30", color: "text-primary" },
  { Icon: Atom, top: "38%", left: "78%", size: "h-8 w-8", duration: "7s", delay: "3.4s", opacity: "opacity-25", color: "text-accent" },
  { Icon: Dna, top: "60%", left: "84%", size: "h-7 w-7", duration: "6.5s", delay: "0.2s", opacity: "opacity-30", color: "text-star" },
  { Icon: TestTube, top: "18%", left: "90%", size: "h-8 w-8", duration: "7.2s", delay: "2.6s", opacity: "opacity-30", color: "text-primary" },
  { Icon: Pill, top: "50%", left: "95%", size: "h-7 w-7", duration: "6.2s", delay: "1.1s", opacity: "opacity-30", color: "text-star" },
  { Icon: Beaker, top: "82%", left: "58%", size: "h-8 w-8", duration: "7.8s", delay: "3.6s", opacity: "opacity-25", color: "text-primary" },
  { Icon: FlaskConical, top: "8%", left: "56%", size: "h-7 w-7", duration: "6.6s", delay: "2s", opacity: "opacity-25", color: "text-star" },
];

function Header({ cartCount, toggleCart }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between overflow-hidden bg-header-glow px-5 py-2.5 shadow-brand-md relative sm:px-14">
      {/* Camada de ícones de química flutuando ao fundo */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {FLOATING_ICONS.map(({ Icon, top, left, size, duration, delay, opacity, color }, index) => (
          <Icon
            key={index}
            strokeWidth={1.5}
            className={`absolute animate-drift ${color} ${size} ${opacity}`}
            style={{
              top,
              left,
              animationDuration: duration,
              animationDelay: delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Logo />
      </div>

      <button
        type="button"
        className="group relative z-10 flex cursor-pointer items-center gap-3 rounded-full border border-line bg-white pl-4 pr-2 py-2 font-body text-[15px] font-bold text-primary-dark shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(0,0,0,0.18)]"
        onClick={toggleCart}
        aria-label={`Abrir carrinho, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`}
      >
        <ShoppingCart className="h-5 w-5 transition group-hover:scale-110" strokeWidth={2} />
        <span className="hidden sm:inline">Carrinho</span>
        <span className="flex h-7 min-w-7 animate-pulseRing items-center justify-center rounded-full bg-accent px-1.5 text-[13px] font-bold text-white">
          {cartCount}
        </span>
      </button>
    </div>
  );
}

export default Header;
