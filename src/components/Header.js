function Header({ cartCount, toggleCart }) {
  return (
    <div className="bg-primary [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:18px_18px] text-white px-[clamp(20px,5vw,56px)] py-[22px] flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="font-display font-bold text-[22px] tracking-[-0.02em] flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-accent" />
        Fiec<span className="text-accent">Lab</span>
      </div>

      <div
        className="cursor-pointer text-[15px] font-semibold font-body flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-full transition-all hover:bg-white/20 hover:-translate-y-px"
        onClick={toggleCart}
      >
        🛒 Carrinho
        <span className="bg-accent text-primary-dark font-bold min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center text-[13px]">
          {cartCount}
        </span>
      </div>
    </div>
  );
}

export default Header;
