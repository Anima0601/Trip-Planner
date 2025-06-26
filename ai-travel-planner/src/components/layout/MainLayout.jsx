import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../custom/Header';

function MainLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;
