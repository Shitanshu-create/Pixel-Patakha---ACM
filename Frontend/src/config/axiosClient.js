import axios from 'axios';
import { API_URL } from './env.js';
import { getToken, removeToken } from '../features/auth/utils/tokenStorage.js';

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    // Backend shape: { success: true, message: '...', data: ... }
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: 'Cannot reach the server. Please check your connection.',
        fieldErrors: {},
      });
    }

    const { status, data } = error.response;
    const message = data?.message || 'An unexpected error occurred.';
    const fieldErrors = {};

    if (Array.isArray(data?.errors)) {
      data.errors.forEach((err) => {
        if (err.field) {
          fieldErrors[err.field] = err.message;
        }
      });
    }

    // Handle 401 on authenticated requests
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/team/login') ||
                           requestUrl.includes('/auth/staff/login') ||
                           requestUrl.includes('/auth/team/register');

    if (status === 401 && !isAuthEndpoint) {
      removeToken();
      window.dispatchEvent(new CustomEvent('pp_session_expired'));
    }

    return Promise.reject({
      status,
      message,
      fieldErrors,
      raw: data,
    });
  }
);

export default axiosClient;
