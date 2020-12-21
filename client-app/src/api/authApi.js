import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
const authApi = {
    postLogin: (username, password) => {
        const url = ApiUrl.GET_TOKEN;
        const data = JSON.stringify({ username, password });
        return axiosClient.post(url, data);
    },
    getAccountInfoByToken: () => {
        const url = ApiUrl.GET_ACCOUNT_INFO;
        return axiosClient.get(url);
    },
    ownerRegister: (value) => {
        const url = ApiUrl.OWNER_REGISTER;
        return axiosClient.post(url, value);
    },
    renterRegister: (value) => {
        const url = ApiUrl.RENTER_REGISTER;
        return axiosClient.post(url, value);
    },
    logout: () => {
        const url = ApiUrl.LOG_OUT;
        return axiosClient.post(url);
    },
};

export default authApi;
