import axios from 'axios';

const instance = axios.create({
  baseURL: 'import.meta.env.VITE_API_BASE_URL/', // your backend URL
});

// Automatically attach JWT token to every request if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
