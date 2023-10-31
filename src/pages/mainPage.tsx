//import { useState } from 'react';
import { login, logout } from '../services/authService';

const MainPage = () => {
  // const [user, setUser] = useState(null);

  const onLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    const user = login(e.currentTarget.name);
    console.log('login!', user);
  };

  const onLogout = async () => {
    logout();
    console.log('sign out successful');
    // setUser(null);
  };

  return (
    <div>
      home
      <button onClick={onLogin} name='Google'>
        Google
      </button>
      <button onClick={onLogin} name='Github'>
        Github
      </button>
      <button onClick={onLogout}>logout</button>
    </div>
  );
};
export default MainPage;
