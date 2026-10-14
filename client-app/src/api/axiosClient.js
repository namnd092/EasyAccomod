import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

// Read the token on every request so a login takes effect without reloading the page.
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        // Falsy bodies such as 0 (a post with no views) or false are real values; only an empty body falls back.
        const body = response && response.data;
        if (body !== undefined && body !== null && body !== '') {
            return body;
        }
        return response;
    },
    (error) => {
        console.log(error.message);
        throw error;
    }
);

export default axiosClient;
