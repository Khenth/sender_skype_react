import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_API_URL } = getEnvVariables()

const axiosClient = axios.create({
    baseURL: `${VITE_API_URL}/api`
})

axiosClient.interceptors.request.use((config) => {
    const headers = {
        ...config.headers,
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        // 'Content-Type': 'application/json', // You can uncomment this line if needed
    };
    return { ...config, headers } as typeof config;
}
);

export default axiosClient;