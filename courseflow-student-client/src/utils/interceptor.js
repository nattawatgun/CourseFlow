import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const useAxiosWithAuth0 = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
  });

  axiosInstance.interceptors.request.use(async (config) => {
    try {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
        console.log(config.headers.Authorization);
      }
    } catch (error) {
      console.error('Error attaching auth token', error);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return { axiosInstance };
};

export default useAxiosWithAuth0;