import { publicApi, secureApi } from './apiClient';

export const fetchVideosList = async () => {
    const response = await publicApi.get('/videos');
    return response.data;
};