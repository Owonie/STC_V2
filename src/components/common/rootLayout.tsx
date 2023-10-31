import { Outlet } from 'react-router-dom';

const RootLayout = (): React.ReactNode => {
  return (
    <div>
      <h1>layout!</h1>
      <Outlet />
    </div>
  );
};
export default RootLayout;
