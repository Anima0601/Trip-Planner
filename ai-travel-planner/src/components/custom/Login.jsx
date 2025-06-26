import React, { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Login() {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    console.log("Google Login Success Token:", tokenResponse);

    if (!tokenResponse.access_token) {
      toast.error("Google Access Token not received. Login failed.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/google', {
        accessToken: tokenResponse.access_token,
      });

      console.log("Backend Response:", res.data);

      if (res.data && res.data.token) {
        localStorage.setItem('userToken', res.data.token);
        toast.success("Successfully logged in!");
        navigate('/create-trip');
      } else {
        toast.error("Login failed: No custom token received from backend.");
      }
    } catch (error) {
      console.error("Error sending token to backend:", error.response?.data || error.message);
      toast.error(`Login error: ${error.response?.data?.message || error.message}`);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast.error("Google login failed. Please try again.");
    },
    scope: 'profile email',
    response_type: 'token id_token',
  });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/create-trip');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Trip Planner!</h2>
        <p className="text-gray-600 mb-8">Sign in to create your personalized travel adventures.</p>

        <button
          onClick={() => login()}
          className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg w-full"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" className="w-6 h-6 mr-3" />
          Sign in with Google
        </button>

        <p className="text-sm text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Login;

