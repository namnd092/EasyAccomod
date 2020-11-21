import axios from "axios";
import queryString from "query-string";

const token = localStorage.getItem('token') || '';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    paramsSerializer: (params) => queryString.stringify(params),
});


axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
  },
    (error) => {
        throw error;
    }
);

export default axiosClient;
