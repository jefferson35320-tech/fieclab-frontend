import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { useUserStore } from '../shared/store/useUserStore';

export function OAuth2RedirectHandler(props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);

  useEffect(() => {
    console.log(searchParams);
    const token = searchParams.get('token');
    console.log(token);

    if (token) {
      localStorage.setItem('jwt_token', token);

      userService
        .getMe()
        .then((r) => {
          const me = r;
          console.log(me);
          setAuth(token, me);

          if (me.status == 'NOT_CONFIRMED') {
            navigate('/cadastro', { replace: true });
          } else {
            userService
              .setToken({ token: props.token, name: me.nome })
              .then((r) => r)
              .catch(console.log);
            navigate('/home', { replace: true });
          }
        })
        .catch((err) => {
          console.log(err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth, props.token]);

  return null;
}