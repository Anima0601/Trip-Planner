
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { signInWithGoogle } from '../../firebaseConfig';
import { Loader2 } from 'lucide-react';

function Login() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [loginError, setLoginError] = useState(null);
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    
    if (!loading && currentUser && location.pathname === '/login') { 
      console.log("Login component: User already logged in, redirecting to /create-trip");
      navigate('/create-trip', { replace: true });
    } else if (!loading && currentUser) {

      console.log("Login component: User logged in, but not on /login path. Current path:", location.pathname);
    }
  }, [currentUser, loading, navigate, location.pathname]); 

  const handleGoogleSignIn = async () => {
    setSignInLoading(true);
    setLoginError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setLoginError("Failed to sign in with Google. Please check your connection or try again.");
      console.error("Login failed:", error);
    } finally {
      setSignInLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Checking authentication state...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#b91c1c]">Welcome Back!</h2>
        <p className="text-gray-600 mb-8">Sign in to unlock personalized travel itineraries.</p>
        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{loginError}</span>
          </div>
        )}
        <Button
          className="w-full py-3 text-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white font-semibold rounded-md"
          onClick={handleGoogleSignIn}
          disabled={signInLoading}
        >
          {signInLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google logo" className="h-5 w-5" />
              Sign in with Google
            </>
          )}
        </Button>
        <p className="mt-4 text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Login;