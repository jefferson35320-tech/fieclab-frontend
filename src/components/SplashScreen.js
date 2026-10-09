import { useEffect, useRef, useState } from "react";
import { Atom, Beaker, FlaskConical, TestTube } from "lucide-react";
import Logo from "./Logo";

// tempo (ms) que o carregamento leva para ir de 0% a 100%
const SPLASH_DURATION = 2600;

const FLOATING_ICONS = [
  { Icon: TestTube, top: "14%", left: "12%", size: "h-9 w-9", delay: "0s", color: "text-primary" },
  { Icon: Atom, top: "70%", left: "16%", size: "h-10 w-10", delay: "1.2s", color: "text-star" },
  { Icon: Beaker, top: "22%", left: "80%", size: "h-9 w-9", delay: "0.6s", color: "text-star" },
  { Icon: FlaskConical, top: "68%", left: "78%", size: "h-11 w-11", delay: "1.8s", color: "text-primary" },
];

function SplashScreen({ onFinish }) {
  // guarda a função mais recente sem reiniciar o timer a cada render do App
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const [progress, setProgress] = useState(0);

  // carregamento de verdade: calcula a porcentagem a cada quadro da tela
  // (não depende de animação CSS, então funciona mesmo com "reduzir movimento" ligado)
  useEffect(() => {
    const start = performance.now();
    let frame;

    function tick(now) {
      const percent = Math.min(100, ((now - start) / SPLASH_DURATION) * 100);
      setProgress(percent);

      if (percent < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        finishRef.current();
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-page"
      role="status"
      aria-label="Carregando o FiecLab"
      onClick={() => finishRef.current()}
    >
      {FLOATING_ICONS.map(({ Icon, top, left, size, delay, color }, index) => (
        <Icon
          key={index}
          className={`absolute ${size} ${color} animate-drift opacity-25 motion-reduce:animate-none`}
          style={{ top, left, animationDelay: delay }}
          aria-hidden="true"
        />
      ))}

      <div className="animate-splashIn motion-reduce:animate-none">
        <Logo large />
      </div>

      <div
        className="mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-primary-light"
        role="progressbar"
        aria-label="Progresso do carregamento"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="m-0 mt-3 font-body text-[13px] font-semibold text-muted">
        Carregando... {Math.round(progress)}%
      </p>
    </div>
  );
}

export default SplashScreen;
