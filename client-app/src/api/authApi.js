import axiosClient from './axiosClient';

const authApi = {
    postLogin: (username, password) => {
        const url = `/login`;
        const data = JSON.stringify({username, password})
        return axiosClient.post(url, data);
    }
}

export default authApi;