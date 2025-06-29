import {create} from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { publicApi, secureApi } from '../api/apiClient';


interface LoginCredentials {
    email: string;
    password: string;
}
interface AuthState {
    user: any;
    isAuthenticated: boolean;
    
    setUser: (user: any) => void;
    login: (credentials: LoginCredentials) => Promise<void>;
    initialize: () => Promise<void>;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set)=>({
    user: null,
    isAuthenticated: false,

    setUser: (user)=>set({
        user,
        isAuthenticated: !!user
    }),
    login: async (credentials) => {
        try {
            console.log("BASE_URL is:", publicApi.defaults.baseURL);
            const response = await publicApi.post('/users/login', credentials)
            const {user, accessToken, refreshToken} = response.data.data;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            set({
                user, 
                isAuthenticated: true
            });
                      
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false
            });
            console.log(error)
        }
    },
    initialize: async ()=>{
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            
            if (accessToken) {
                const response = await secureApi.get('/users/current-user');
                set({ 
                    user: response.data.data, 
                    isAuthenticated: true 
                });
            }
        } catch (error) {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            set({ 
                user: null, 
                isAuthenticated: false 
            });
        }
    },
    logout: async ()=>{
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');

        set({
            user: null,
            isAuthenticated: false
        });
    }

}))

export default useAuthStore