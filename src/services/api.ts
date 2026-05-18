import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Lazy import to avoid circular dependency (store → slices → services → api → store)
const getStore = () => import('@/store').then((m) => m.store);
let _store: Awaited<ReturnType<typeof getStore>> | null = null;

async function resolveStore() {
  if (!_store) {
    _store = await getStore();
  }
  return _store;
}

// Synchronous store access (available after first async resolution)
function getStoreSync() {
  return _store;
}

// Initialize store reference immediately (runs once on first import)
resolveStore();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const store = getStoreSync();
    let token = store?.getState().auth.accessToken;

    // Fallback: read from localStorage if store not yet resolved
    if (!token) {
      try {
        const stored = localStorage.getItem('auth');
        if (stored) {
          token = JSON.parse(stored).accessToken;
        }
      } catch {
        // ignore
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(undefined);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Don't retry refresh-token requests to avoid deadlock
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      console.log('[API] 401 on', originalRequest?.url, '— attempting token refresh');
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const store = await resolveStore();
        const { refreshToken } = await import('@/store/slices/authSlice');
        await store.dispatch(refreshToken()).unwrap();
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        console.log('[API] Refresh token failed:', refreshError);
        processQueue(error);
        // Only clear auth if refresh token is truly invalid (not network errors)
        const refreshErr = refreshError as { response?: { status?: number } };
        if (refreshErr?.response?.status === 401 || refreshErr?.response?.status === 403) {
          console.log('[API] Refresh token invalid — clearing auth');
          const store = await resolveStore();
          const { clearAuth } = await import('@/store/slices/authSlice');
          const { addToast } = await import('@/store/slices/uiSlice');
          store.dispatch(clearAuth());
          store.dispatch(addToast({
            id: uuidv4(),
            message: 'Session expired. Please login again.',
            type: 'error',
          }));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
