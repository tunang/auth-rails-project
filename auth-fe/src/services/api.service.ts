import axios from 'axios';
// import { store } from '../store';
// import { logoutSuccess } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "*",
    'Content-Type': 'application/json',
  },
});

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Queue để lưu trữ các request thất bại trong quá trình refresh token
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

// Xử lý queue các request thất bại
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  
  failedQueue = [];
};

// Request interceptor để thêm token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
  },

  (error) => Promise.reject(error)
);

// Response interceptor xử lý errors và refresh token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.error('API Error:', error);
    
    const originalRequest = error.config;
    
    // Kiểm tra nếu error là 401 và liên quan đến access token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Access token expired, starting refresh process...');
      
      if (isRefreshing) {
        console.log('Token refresh already in progress, queuing request...');
        // Nếu đã đang refresh, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          //If processQueue is successful, retry the request
          console.log('Retrying queued request after token refresh...');
          return api(originalRequest);
        }).catch(err => {
          //If processQueue is failed, reject the request
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting to refresh token...');
        
        // Check refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');
        
        // Get new access token
        const response = await apiAuth.post('/refresh_token', { refresh_token: refreshToken });
        console.log('Token refreshed successfully:', response.data);
        
        // Save new token
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        // Process all requests in queue
        processQueue(null, access_token);
        isRefreshing = false;
        
        // Thử lại request gốc
        console.log('Retrying original request after token refresh...');
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Xử lý queue với error
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Dispatch logout action
        console.log('Logging out user due to refresh failure...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // store.dispatch(logoutSuccess());
        
        // Redirect đến trang login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  },
);

// API instance cho upload files
const apiDefaultUpload = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    "ngrok-skip-browser-warning": "*",
  },
});

// Thêm interceptor cho upload API
apiDefaultUpload.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Reset Password API functions
export const forgotPassword = async (email: string) => {
  try {
    const response = await apiAuth.post('/password', {
      user: { email }
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const resetPassword = async (reset_password_token: string, password: string, password_confirmation: string) => {
  try {
    const response = await apiAuth.put('/password', {
      user: {
        reset_password_token,
        password,
        password_confirmation
      }
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export default api;
export { api, apiDefaultUpload };