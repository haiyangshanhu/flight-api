import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import AuthService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading, login } = useAuth();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (isAuthenticated) {
          navigate('/home');
        }
      } finally {
        // Finish initialization after checking auth status
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { email, password } = credentials;

      // Call login service
      const { success, message, data } = await login({ email, password });
      if (success) {
        // Redirect to home on successful login
        toast.success('Login successful! Welcome back.', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          localStorage.setItem('token', data.token);
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: data.userId,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
            }),
          );
          // Redirect to home on successful login
          navigate('/home');
        }, 1800);
      } else {
        setError(message);
      }
    } catch (error) {
      // Display error message
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading skeleton during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-sm border-gray-100">
          <CardHeader className="text-center space-y-1 pb-2">
            <Skeleton width={200} height={30} className="mx-auto" />
          </CardHeader>
          <CardContent className="pt-4 px-6 pb-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton width={120} height={20} />
                <Skeleton height={48} />
              </div>
              <div className="space-y-2">
                <Skeleton width={100} height={20} />
                <Skeleton height={48} />
              </div>
              <div>
                <Skeleton width={180} height={16} />
              </div>
              <Skeleton height={48} />
              <div className="pt-1">
                <Skeleton width={220} height={16} className="mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer />
      <Card className="w-full max-w-md shadow-sm border-gray-100">
        <CardHeader className="text-center space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-6 pb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-normal">
                  Username or email
                </Label>
                {isLoading ? (
                  <Skeleton height={48} />
                ) : (
                  <Input
                    id="email"
                    placeholder="Enter your username or email"
                    type="text"
                    required
                    className="h-12"
                    value={credentials.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-normal">
                  Password
                </Label>
                {isLoading ? (
                  <Skeleton height={48} />
                ) : (
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    required
                    className="h-12"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                  Forgot username or password?
                </div>
              </div>

              {isLoading ? (
                <Skeleton height={48} />
              ) : (
                <Button
                  type="submit"
                  size={'default'}
                  variant={'outline'}
                  className="w-full h-12 bg-blue-200 hover:bg-blue-300 text-gray-800 font-medium"
                  disabled={isLoading}
                >
                  Log in
                </Button>
              )}

              <div className="text-center text-sm text-gray-600 pt-1">
                Don't have an account?{' '}
                <span
                  onClick={() => {
                    if (!isLoading) navigate('/register');
                  }}
                  className={`text-gray-900 font-medium ${!isLoading ? 'hover:underline cursor-pointer' : ''}`}
                >
                  Sign up
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
