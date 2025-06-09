// src/services/api.js

import axios from 'axios';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API = axios.create({// 创建带基础配置的axios实例
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 从本地存储获取 token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;// 添加认证头
    }
    return config;// 返回修改后的配置对象
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

export default API;
