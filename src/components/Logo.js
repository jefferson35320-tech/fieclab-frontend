function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Selo com frasco + órbita — marca autoral do FiecLab */}
      <svg
        viewBox="0 0 140 140"
        className="h-11 w-11 shrink-0 sm:h-14 sm:w-14"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="132" height="132" rx="30" fill="#004f5f" />
        <ellipse
          cx="70"
          cy="72"
          rx="54"
          ry="24"
          fill="none"
          stroke="#f5a623"
          strokeWidth="3"
          opacity="0.55"
          transform="rotate(-24 70 72)"
        />
        <rect x="60" y="26" width="20" height="26" rx="3" fill="#f4f8f9" />
        <rect x="55" y="22" width="30" height="8" rx="3" fill="#f4f8f9" />
        <path
          d="M60 50 L80 50 L110 106 Q116 118 104 118 L36 118 Q24 118 30 106 Z"
          fill="#f4f8f9"
        />
        <path
          d="M44 86 L96 86 L104 104 Q108 112 100 112 L40 112 Q32 112 36 104 Z"
          fill="#e50020"
        />
        <circle cx="60" cy="94" r="3.5" fill="#ffffff" opacity="0.85" />
        <circle cx="76" cy="100" r="2.5" fill="#ffffff" opacity="0.7" />
        <circle cx="68" cy="106" r="2" fill="#ffffff" opacity="0.6" />
      </svg>

      <div className="flex flex-col leading-none">
        <span className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          <span className="text-primary-dark">Fiec</span>
          <span className="text-accent">Lab</span>
        </span>
        <span className="mt-1 hidden font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:block">
          Laboratório &amp; Ensino
        </span>
      </div>
    </div>
  );
}

export default Logo;
