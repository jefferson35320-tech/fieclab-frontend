import { LottieLight as Lottie } from "lottie-react";
import loadingAnimation from "../../assets/lottie/loading.json";
import successAnimation from "../../assets/lottie/success.json";
import errorAnimation from "../../assets/lottie/error.json";

const ANIMATIONS = {
  loading: loadingAnimation,
  success: successAnimation,
  error: errorAnimation,
};

// tela por cima de tudo com a animação Lottie e a mensagem
// feedback = { type: "loading" | "success" | "error", message }
function FeedbackOverlay({ feedback, onClose }) {
  if (!feedback) return null;

  const { type, message } = feedback;
  const isLoading = type === "loading";

  return (
    <div
      className="fixed inset-0 z-[70] flex animate-fadeIn items-center justify-center bg-black/40 px-5"
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      // sucesso e erro fecham ao clicar fora; o "carregando" não
      onClick={isLoading ? undefined : onClose}
    >
      <div
        className="flex w-full max-w-xs flex-col items-center rounded-brand border border-line bg-surface px-6 pb-6 pt-4 text-center shadow-brand-md"
        onClick={(event) => event.stopPropagation()}
      >
        <Lottie
          key={type}
          src={ANIMATIONS[type]}
          autoplay
          loop={isLoading}
          className="h-32 w-32"
        />
        <p className="m-0 mt-1 font-body text-[15px] font-semibold text-ink">
          {message}
        </p>

        {type === "error" && (
          <button
            type="button"
            onClick={onClose}
            className="mt-4 cursor-pointer rounded-full border-0 bg-primary px-6 py-2 font-body text-[14px] font-semibold text-white transition hover:bg-primary-dark"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}

export default FeedbackOverlay;
