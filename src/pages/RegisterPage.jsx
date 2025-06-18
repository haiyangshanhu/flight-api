import React from 'react';
import { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/authService';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading } = useAuth();

  // 注册表单数据状态
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: '',
    phone: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (isAuthenticated) {
          navigate('/home');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, [isAuthenticated, navigate]);

  // 处理表单输入变化
  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log('Input changed=========', id, value); // 添加调试
    setRegisterData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 表单验证
  const validateForm = () => {
    console.log('validateForm called with data:', registerData);
    const { email, password, firstName, lastName, country } = registerData;
    console.log('Checking required fields:', { email, password, firstName, lastName, country });

    if (!email || !password || !firstName || !lastName || !country) {
      setError('Please fill in all required fields.');
      return false;
    }

    console.log('password.length:', password.length);
    console.log('Password type:', typeof password);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  // 处理注册提交
  const handleSignup = async (e) => {
    console.log('handleSignup called===========start');
    e.preventDefault();
    setError('');

    // 添加调试信息
    console.log('Form data before validation:', registerData.password);
    // 表单验证
    if (!validateForm()) {
      return;
      console.log('Form validation failed');
    }
    console.log('Form validation passed');
    setIsLoading(true);

    try {
      console.log('Register data:', registerData);

      // 调用注册服务
      const response = await AuthService.register(registerData);
      console.log('Register response:', response);

      if (response.success) {
        // 注册成功
        toast.success('Registration successful! Welcome to our platform.', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setTimeout(() => {
          // 如果注册返回了token，直接登录用户
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem(
              'user',
              JSON.stringify({
                id: response.userId,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
              }),
            );
            navigate('/home');
          } else {
            // 否则跳转到登录页面
            navigate('/login');
          }
        }, 1800);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please check your information and try again.');
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
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton width={120} height={20} />
                  <Skeleton height={48} />
                </div>
              ))}
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
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-xl shadow-none border-none">
        <CardHeader className="space-y-1 p-4 pb-0 text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSignup}>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-normal"> Email address</Label>
                <Input id="email" value={registerData.email} onChange={handleChange} placeholder="Enter your email address" type="email" required className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-normal">Password</Label>
                <Input
                  id="password" value={registerData.password} onChange={handleChange} placeholder="Create a password" type="password" required className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base font-normal">First name</Label>
                <Input id="firstName" value={registerData.firstName} onChange={handleChange} placeholder="Enter your first name" type="text" required className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base font-normal">Last name</Label>
                <Input id="lastName" value={registerData.lastName} onChange={handleChange} placeholder="Enter your last name" type="text" required className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-base font-normal">Country/Region</Label>
                {<Select
                  value={registerData.country}
                  onValueChange={(value) => {
                    console.log('Country selected:', value);
                    setRegisterData((prev) => ({
                      ...prev,
                      country: value
                    }));
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger id="country" className="h-12">
                    <SelectValue placeholder="Select your country/region" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem className="" value="us">United States</SelectItem>
                    <SelectItem className="" value="ca">Canada</SelectItem>
                    <SelectItem className="" value="uk">United Kingdom</SelectItem>
                    <SelectItem className="" value="au">Australia</SelectItem>
                    <SelectItem className="" value="de">Germany</SelectItem>
                    <SelectItem className="" value="fr">France</SelectItem>
                    <SelectItem className="" value="jp">Japan</SelectItem>
                    <SelectItem className="" value="cn">China</SelectItem>
                  </SelectContent>
                </Select>
                }

              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-normal">Phone number</Label>
                <Input id="phone" value={registerData.phone} onChange={handleChange} placeholder="Enter your phone number" type="tel" className="h-12" />
              </div>

              <Button
                size={'lg'} variant={'outline'} type="submit"
                className="w-full h-12 bg-blue-200 hover:bg-blue-300 text-gray-800 font-medium transition-colors rounded-full"
                disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Register'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;
