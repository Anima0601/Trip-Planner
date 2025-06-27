// src/components/custom/Header.jsx

import React from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../firebaseConfig';

function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-[#b91c1c]">Travel Planner</span>
      </div>
      <nav>
        {currentUser ? (
          <Button onClick={handleSignOut} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Sign Out
          </Button>
        ) : (
          <Button onClick={() => navigate('/login')} className="bg-[#b91c1c] hover:bg-[#991b1b] text-white">
            Get Started
          </Button>
        )}
      </nav>
    </header>
  );
}

export default Header;