import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "../config/api";
import FeedbackOverlay from "../shared/components/FeedbackOverlay";

const FeedbackContext = createContext(null);

const SUCCESS_TIME = 1800; // ms que o modal de sucesso fica visível
const ERROR_TIME = 4000; // ms que o modal de erro fica visível

// Mensagens padrão para operações de escrita (GET não exibe modal de sucesso)
const DEFAULT_SUCCESS = {
  post: "Cadastrado com sucesso!",
  put: "Salvo com sucesso!",
  patch: "Salvo com sucesso!",
  delete: "Excluído com sucesso!",
};

export function getErrorMessage(error) {
  if (!error.response) {
    return error.code === "ECONNABORTED"
      ? "O servidor demorou demais para responder."
      : "Não foi possível conectar ao servidor.";
  }

  const { status } = error.response;
  if (status === 400) return "Dados inválidos. Confira os campos e tente de novo.";
  if (status === 401 || status === 403) return "Acesso negado. Faça login para continuar.";
  if (status === 404) return "Item não encontrado.";
  if (status >= 500) return "Erro no servidor. Tente novamente em instantes.";
  return "Algo deu errado. Tente novamente.";
}

export function FeedbackProvider({ children }) {
  const [feedback, setFeedback] = useState(null); // { type, message } ou null
  const pendingLoading = useRef(0); // controla apenas requisições que abriram o loading
  const timer = useRef(null);

  const hideFeedback = useCallback(() => {
    clearTimeout(timer.current);
    setFeedback(null);
  }, []);

  const showFeedback = useCallback((type, message) => {
    clearTimeout(timer.current);
    setFeedback({ type, message });

    if (type === "success") {
      timer.current = setTimeout(() => setFeedback(null), SUCCESS_TIME);
    }
    if (type === "error") {
      timer.current = setTimeout(() => setFeedback(null), ERROR_TIME);
    }
  }, []);

  // Conecta os interceptors do axios: chamadas à API passam por aqui
  useEffect(() => {
    const shouldShowLoading = (config = {}) => {
      if (config.silent) return false;
      const method = (config.method || "get").toLowerCase();
      // Por padrão exibe loading apenas em escrita; GET pode forçar via { showLoading: true }
      return method !== "get" || Boolean(config.showLoading);
    };

    const requestId = api.interceptors.request.use(
      (config) => {
        if (shouldShowLoading(config)) {
          pendingLoading.current += 1;
          showFeedback("loading", config.loadingMessage || "Carregando...");
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseId = api.interceptors.response.use(
      (response) => {
        const config = response.config || {};
        const method = (config.method || "get").toLowerCase();

        if (shouldShowLoading(config)) {
          pendingLoading.current = Math.max(0, pendingLoading.current - 1);
        }

        if (config.silent) {
          return response;
        }

        if (method !== "get") {
          // Mensagem pode ser customizada na chamada: api.put(url, dados, { successMessage: "..." })
          showFeedback(
            "success",
            config.successMessage || DEFAULT_SUCCESS[method] || "Operação concluída!"
          );
        } else if (pendingLoading.current === 0) {
          hideFeedback();
        }

        return response;
      },
      (error) => {
        const config = error.config || {};

        if (shouldShowLoading(config)) {
          pendingLoading.current = Math.max(0, pendingLoading.current - 1);
        }

        if (!config.silent) {
          showFeedback("error", config.errorMessage || getErrorMessage(error));
        } else if (pendingLoading.current === 0) {
          hideFeedback();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestId);
      api.interceptors.response.eject(responseId);
      clearTimeout(timer.current);
    };
  }, [showFeedback, hideFeedback]);

  const value = useMemo(
    () => ({ showFeedback, hideFeedback }),
    [showFeedback, hideFeedback]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackOverlay feedback={feedback} onClose={hideFeedback} />
    </FeedbackContext.Provider>
  );
}

// Uso manual em qualquer componente:
// const { showFeedback } = useFeedback();
// showFeedback("success", "Produto adicionado ao carrinho!");
export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback precisa estar dentro de <FeedbackProvider>");
  }
  return context;
}