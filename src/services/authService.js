// src/services/authService.js

import API from './http';

const AuthService = {
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      console.log('register================' + userData );
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: response.data.userId,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          }),
        );
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  isValidateToken: async (token) => {
    try {
      const response = await API.post('/token/validate', { token });
      return response.data;
    } catch (err) {
      throw err.response ? err.response.data : err.message;
    }
  },

  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      console.log('Login response:', response.data);

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isLoggedIn: async () => {
    const data = await AuthService.isValidateToken(localStorage.getItem('token'));
    console.log('isLoggedIn data:', data);
    console.log('isLoggedIn token:', localStorage.getItem('token'));
    console.log(!!localStorage.getItem('token') && data.success);
    return !!localStorage.getItem('token') && data.success;
  },
};

export default AuthService;
