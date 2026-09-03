import { useEffect } from "react";

function ImageLightbox({ images, activeIndex, onClose, onNavigate, alt }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && images.length > 1) {
        onNavigate((activeIndex + 1) % images.length);
      }
      if (e.key === "ArrowLeft" && images.length > 1) {
        onNavigate((activeIndex - 1 + images.length) % images.length);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-[2] flex h-10 w-10 items-center justify-center rounded-full border-none bg-white/90 text-lg text-primary-dark transition hover:bg-white"
        onClick={onClose}
        aria-label="Fechar imagem ampliada"
      >
        ✕
      </button>

      <img
        src={images[activeIndex]}
        alt={alt}
        className="max-h-[85vh] max-w-[90vw] animate-fadeIn rounded-lg object-contain shadow-brand-md"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-none bg-white/90 text-xl text-primary-dark transition hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex - 1 + images.length) % images.length);
            }}
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-none bg-white/90 text-xl text-primary-dark transition hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex + 1) % images.length);
            }}
            aria-label="Próxima foto"
          >
            ›
          </button>

          <div
            className="absolute bottom-5 left-1/2 z-[2] flex -translate-x-1/2 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                className={`h-2.5 w-2.5 rounded-full border-none transition ${
                  i === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
                onClick={() => onNavigate(i)}
                aria-label={`Ir para foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageLightbox;
