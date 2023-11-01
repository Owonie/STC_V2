import { Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../../states/accountState';
import ProfileBar from './profileBar';

const RootLayout = (): React.ReactNode => {
  const [isAuthed] = useRecoilState(authState);

  return (
    <div>
      {isAuthed && <ProfileBar />}
      <h1>layout!</h1>
      <Outlet />
    </div>
  );
};
export default RootLayout;
