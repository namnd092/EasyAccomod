import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
const authApi = {
    postLogin: (username, password) => {
        const url = ApiUrl.GET_TOKEN;
        const data = JSON.stringify({username, password})
        return axiosClient.post(url, data);
    },
    getAccountInfoByToken: () => {
        const url = ApiUrl.GET_ACCOUNT_INFO;
        return axiosClient.get(url);
    }
}

export default authApi;