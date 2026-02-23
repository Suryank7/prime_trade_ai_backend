import axios from 'axios';

// Get base URL from env or use default local backend port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For HTTP-only refresh cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we get a 401 on a protected route (exclude auth routes where 401 means wrong password/already exists)
    if (error.response?.status === 401 && !error.config.url?.startsWith('/auth/')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Use window.location only if not already on auth pages
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
