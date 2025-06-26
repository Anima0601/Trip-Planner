
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner'; 

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token); 
  }, [location]);

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleSignOut = () => {
    localStorage.removeItem('userToken'); 
    setIsLoggedIn(false); 
    toast.info("You have been signed out.");
    navigate('/'); 
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm shadow-md p-4 flex justify-between items-center z-50">
      <div className="logo">
        <Link to="/" className="text-2xl font-bold text-red-700">Project Planner</Link> 
      </div>
      <nav>
        <ul className="flex space-x-6 items-center">
          <li><Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/create-trip" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Create Trip</Link></li>
              <li>
                <Button onClick={handleSignOut}>Sign Out</Button> 
              </li>
            </>
          ) : (
            <li>
           
              {location.pathname !== '/login' && (
                <Button onClick={handleSignInClick}>Sign In</Button>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
