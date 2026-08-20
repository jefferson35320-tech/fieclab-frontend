function Header({ cartCount, toggleCart }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-header-glow bg-dots bg-[length:18px_18px] px-5 py-[18px] text-white shadow-brand-md sm:px-14">
      <div className="flex items-center gap-3 font-display text-[24px] font-extrabold tracking-tight">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-lg shadow-[0_4px_14px_rgba(229,0,32,0.5)]">
          🧴
        </span>
        Fiec<span className="text-accent">Lab</span>
      </div>

      <button
        type="button"
        className="group flex cursor-pointer items-center gap-3 rounded-full bg-white pl-4 pr-2 py-2 font-body text-[15px] font-bold text-primary-dark shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(0,0,0,0.3)]"
        onClick={toggleCart}
        aria-label={`Abrir carrinho, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`}
      >
        <span className="text-xl transition group-hover:scale-110">🛒</span>
        <span className="hidden sm:inline">Carrinho</span>
        <span className="flex h-7 min-w-7 animate-pulseRing items-center justify-center rounded-full bg-accent px-1.5 text-[13px] font-bold text-white">
          {cartCount}
        </span>
      </button>
    </div>
  );
}

export default Header;
