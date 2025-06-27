
import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from './components/custom/Header'; 

function MainAppLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}

function App() {
  return <MainAppLayout />;
}

export default App;