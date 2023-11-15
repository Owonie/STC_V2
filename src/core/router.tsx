import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/mainPage';
import RoomPage from '../pages/roomPage';
import SearchPage from '../pages/searchPage';
import RootLayout from '../components/common/rootLayout';
import ErrorPage from '../pages/errorPage';
import ServerPage from '../pages/serverPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <MainPage /> },
      { path: 'server', element: <ServerPage /> },
      { path: 'room', element: <RoomPage /> },
      {
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
]);
