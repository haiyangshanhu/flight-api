// src/services/api.js

import axios from 'axios';

// 统一配置所有请求的基础路径和默认 JSON 数据格式
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// 请求拦截器（request）在每次发送请求前自动执行
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

//响应拦截器（response）在接收到响应后自动处理错误
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
