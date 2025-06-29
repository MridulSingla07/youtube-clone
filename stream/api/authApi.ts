import { publicApi, secureApi } from './apiClient';

export const loginUser = async (credentials : any) => {
  const response = await publicApi.post('/users/login', credentials);
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await publicApi.post('/users/register', userData);
  return response.data;
};

export const fetchCurrentUserProfile = async () => {
  const response = await secureApi.get('/users/current-user');
  return response.data;
};

export const fetchChannelData = async(username: string)=>{
  const response = await publicApi.get(`/channel/${username}`);
  return response.data;
}

export const logoutUser = async () => {
  const response = await secureApi.post('/users/logout');
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await publicApi.post('/users/refresh-tokens', { refreshToken });
  return response.data;
};