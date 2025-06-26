import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from './components/custom/Login';
import Createtrip from './trip-planner/index.jsx';
import TripResult from './trip-result.jsx';

import { Toaster } from 'sonner';

import MainLayout from './components/layout/MainLayout.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("VITE_GOOGLE_CLIENT_ID is not defined. Please set it in your .env file in the frontend root.");
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'create-trip',
        element: <Createtrip />,
      },
      {
        path: 'trip-result',
        element: <TripResult />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <Toaster />
    </GoogleOAuthProvider>
  </StrictMode>,
);
