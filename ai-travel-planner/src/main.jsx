import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner';
import Hero from './components/custom/Hero';
import Login from './components/custom/Login';
import Createtrip from './trip-planner/index.jsx'; 
import TripResult from './trip-result.jsx';
import PrivateRoute from './components/custom/PrivateRoute';
import AppLayout from './App.jsx';

const router = createBrowserRouter([
  {
    element: <AppLayout />, 
    children: [
      {
        path: '/', 
        element: <Hero />,
      },
      {
        path: 'login', 
        element: <Login />,
      },
      {
        path: 'create-trip',
        element: (
          <PrivateRoute>
            <Createtrip />
          </PrivateRoute>
        ),
      },
      {
        path: 'trip-result/:tripId?',
        element: (
          <PrivateRoute>
            <TripResult />
          </PrivateRoute>
        ),
      },
      {
        path: '*', 
        element: <Hero />, 
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <Toaster />
  </StrictMode>,
);