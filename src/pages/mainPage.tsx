import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState, userState } from '../states/accountState';
import { login, logout } from '../services/authService';

const MainPage = () => {
  //TODO: 커스텀 훅으로 분리하기
  const [isAuthed, setIsAuthed] = useRecoilState(authState);
  const setUser = useSetRecoilState(userState);

  const onLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAuthed) {
      console.log('이미 로그인 된 상태입니다!');
      return;
    }
    login(e.currentTarget.name).then((user) => {
      if (user) {
        const { displayName, photoURL, accessToken } = user;
        setUser({
          displayName: displayName ?? '',
          photoURL: photoURL ?? '',
          accessToken: accessToken ?? '',
        });
        setIsAuthed(true);
      }
    });
  };

  const onLogout = async () => {
    logout();
    setIsAuthed(false);
  };

  return (
    <div>
      {!isAuthed ? (
        <div>
          <button onClick={onLogin} name='Google'>
            Google
          </button>
          <button onClick={onLogin} name='Github'>
            Github
          </button>
        </div>
      ) : (
        <button onClick={onLogout}>logout</button>
      )}
    </div>
  );
};
export default MainPage;
