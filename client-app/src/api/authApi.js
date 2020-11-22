import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
const authApi = {
    postLogin: (username, password) => {
        const url = ApiUrl.GET_TOKEN;
        const data = JSON.stringify({username, password})
        return axiosClient.post(url, data);
    }
}

export default authApi;