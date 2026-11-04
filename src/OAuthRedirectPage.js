import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOAuthRedirect } from './useOAuthRedirect';

export function OAuthRedirectPage() {
  const navigate = useNavigate();
  const { token, error } = useOAuthRedirect();

  useEffect(() => {
    // Assim que o token for detectado e salvo, redireciona para a Home
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  if (error) {
    return <div>Erro na autenticação: {error}</div>;
  }

  return <div>Processando autenticação... aguarde.</div>;
}