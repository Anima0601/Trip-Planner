import React, { useEffect, useState } from 'react';
import { signInWithGoogle, auth, onAuthStateChanged } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('userToken', user.uid);
        console.log("User detected as logged in:", user.uid);
        navigate('/create-trip');
      } else {
        localStorage.removeItem('userToken');
        console.log("User detected as logged out.");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLoginError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setLoginError("Failed to sign in with Google. Please check your connection or try again.");
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Travel Planner</h2>
        <p className="mb-6 text-gray-600">Sign in to start planning your next adventure!</p>
        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{loginError}</span>
          </div>
        )}
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2 flex items-center justify-center gap-2"
        >
          {loading ? (
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
