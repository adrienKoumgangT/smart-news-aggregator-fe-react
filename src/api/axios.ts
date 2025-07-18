import axios from "axios";


const API = axios.create({
    baseURL: 'http://127.0.0.1:5050/api',
    withCredentials: true,
});

// Attach the token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');

    config.headers = config.headers || {};

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.withCredentials = true;
    }

    // config.withCredentials = true;

    return config;
});

// Handle 401 globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized! Redirecting to login...");

            localStorage.removeItem('authToken');

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default API;
