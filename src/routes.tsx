
import { RouteObject } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Migrate from './pages/Migrate';
import HowItWorks from './pages/HowItWorks';
import AuthCallback from './pages/AuthCallback';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/migrate',
    element: <Migrate />,
  },
  {
    path: '/how-it-works',
    element: <HowItWorks />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
