function Header({ cartCount, toggleCart }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-primary bg-dots bg-[length:18px_18px] px-5 py-[22px] text-white shadow-brand-sm sm:px-14">
      <div className="flex items-center gap-2.5 font-display text-[22px] font-bold tracking-tight">
        <span className="h-2 w-2 rounded-full bg-accent" />
        Fiec<span className="text-accent">Lab</span>
      </div>

      <div
        className="flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 font-body text-[15px] font-semibold transition hover:-translate-y-px hover:bg-white/20"
        onClick={toggleCart}
      >
        🛒 Carrinho
        <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-accent px-1.5 text-[13px] font-bold text-primary-dark">
          {cartCount}
        </span>
      </div>
    </div>
  );
}

export default Header;
