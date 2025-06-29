import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import useAuthStore from '../store/authStore';


const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
//  || 'http://localhost:8000/api/v1'

export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const secureApi = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

// Attach access token to every secure API request
secureApi.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh on 401 errors
secureApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Get refresh token
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          if (!refreshToken) throw new Error('No refresh token available');
          
          // Call refresh endpoint with public API (no auth needed)
          const response = await publicApi.post('/users/refresh-tokens', {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update stored tokens
          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
          
          // Update authorization header and retry
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return secureApi(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout user
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');

          useAuthStore.getState().logout()
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );