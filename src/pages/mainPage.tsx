import { useRecoilState } from 'recoil';
import { authState } from '../states/authState';
import { login, logout } from '../services/authService';

const MainPage = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const onLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    login(e.currentTarget.name).then((user) => {
      if (user) setAuth(user.displayName);
    });
  };

  const onLogout = async () => {
    logout();
    setAuth(null);
  };

  return (
    <div>
      home
      <h4>{auth}</h4>
      <div>
        <button onClick={onLogin} name='Google'>
          Google
        </button>
        <button onClick={onLogin} name='Github'>
          Github
        </button>
        <button onClick={onLogout}>logout</button>
      </div>
    </div>
  );
};
export default MainPage;
