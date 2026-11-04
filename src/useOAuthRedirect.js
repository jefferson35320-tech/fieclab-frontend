import { useEffect, useState } from 'react';

export function useOAuthRedirect() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tenta buscar o token da query string (?token=... ou ?access_token=...)
    const queryParams = new URLSearchParams(window.location.search);
    let extractedToken = queryParams.get('token') || queryParams.get('access_token');

    console.log(extractedToken)

    // Tenta buscar no fragmento de hash (#access_token=...)
    if (!extractedToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      extractedToken = hashParams.get('access_token');
    }

    if (extractedToken) {
      // Salva no localStorage e atualiza o estado
      localStorage.setItem('token', extractedToken);
      setToken(extractedToken);
      
      // Limpa a URL para esconder o token
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setError('Nenhum token encontrado na URL de redirecionamento.');
    }
  }, []); // Array de dependências vazio para executar apenas na montagem

  return { token, error };
}