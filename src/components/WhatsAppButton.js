// Número de WhatsApp para contato. Configure via variável de ambiente
// REACT_APP_WHATSAPP_NUMBER (formato: código do país + DDD + número, só dígitos).
// Ex: REACT_APP_WHATSAPP_NUMBER=5511999999999
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "5511999999999";
const DEFAULT_MESSAGE = "Olá! Vim pelo site da FiecLab e gostaria de mais informações.";

function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    DEFAULT_MESSAGE
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(0,0,0,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-7 sm:right-7"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <svg
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="currentColor"
        aria-hidden="true"
        className="relative"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.42.71 4.673 1.936 6.573L4 29l7.61-1.902A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.98 16.958c-.297.834-1.47 1.53-2.403 1.727-.638.135-1.47.242-4.276-.914-3.588-1.478-5.9-5.117-6.08-5.354-.174-.237-1.454-1.934-1.454-3.69 0-1.756.908-2.62 1.23-2.978.297-.33.65-.412.867-.412.216 0 .434.002.624.012.2.01.47-.076.735.562.297.716.99 2.472 1.076 2.652.087.18.144.393.03.63-.114.238-.174.386-.343.593-.174.207-.36.462-.516.62-.174.176-.354.367-.152.72.2.354.897 1.478 1.926 2.393 1.323 1.177 2.436 1.542 2.79 1.716.354.176.56.147.767-.09.207-.238.868-1.01 1.1-1.36.234-.35.47-.29.79-.174.32.118 2.043.963 2.394 1.14.35.176.585.264.672.412.087.147.087.85-.21 1.685Z" />
      </svg>
    </a>
  );
}

export default WhatsAppButton;
