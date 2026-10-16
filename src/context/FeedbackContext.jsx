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

const SUCCESS_TIME = 1800; // ms que a animação de sucesso fica na tela
const ERROR_TIME = 4000; // ms que a animação de erro fica na tela

// mensagem padrão de sucesso para cada tipo de chamada (GET não mostra sucesso)
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
  const pending = useRef(0); // quantas chamadas ainda estão em andamento
  const timer = useRef(null);

  const hideFeedback = useCallback(() => {
    clearTimeout(timer.current);
    setFeedback(null);
  }, []);

  const showFeedback = useCallback((type, message) => {
    clearTimeout(timer.current);
    setFeedback({ type, message });

    // sucesso e erro somem sozinhos; o "carregando" fica até a chamada terminar
    if (type === "success") {
      timer.current = setTimeout(() => setFeedback(null), SUCCESS_TIME);
    }
    if (type === "error") {
      timer.current = setTimeout(() => setFeedback(null), ERROR_TIME);
    }
  }, []);

  // liga os interceptors do axios: toda chamada à API passa por aqui
  useEffect(() => {
    const requestId = api.interceptors.request.use((config) => {
      pending.current += 1;
      showFeedback("loading", "Carregando...");
      return config;
    });

    const responseId = api.interceptors.response.use(
      (response) => {
        pending.current = Math.max(0, pending.current - 1);
        const method = response.config.method;

        if (method !== "get") {
          // a mensagem pode ser trocada na chamada: api.put(url, dados, { successMessage: "..." })
          showFeedback(
            "success",
            response.config.successMessage || DEFAULT_SUCCESS[method]
          );
        } else if (pending.current === 0) {
          hideFeedback();
        }
        return response;
      },
      (error) => {
        pending.current = Math.max(0, pending.current - 1);
        showFeedback("error", error.config?.errorMessage || getErrorMessage(error));
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

// uso: const { showFeedback } = useFeedback(); showFeedback("success", "Pronto!");
export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback precisa estar dentro de <FeedbackProvider>");
  }
  return context;
}
