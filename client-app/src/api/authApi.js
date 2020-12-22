import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
import queryString from 'query-string';
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
    getOwnerSuccess(_page, _limit) {
        const url =
            ApiUrl.GET_OWNERS +
            `?_page=${_page}&_limit=${_limit}&confirmationStatus=${1}`;
        return axiosClient.get(url);
    },
    getOwnerRegisterPending(_page, _limit) {
        const url =
            ApiUrl.GET_OWNERS +
            `?_page=${_page}&_limit=${_limit}&confirmationStatus=${-1}`;
        return axiosClient.get(url);
    },
    postRequireEditInfo() {
        const url = ApiUrl.REQUIRE_EDIT_INFO;
        return axiosClient.post(url);
    },
    putEditProfile(params) {
        const url = ApiUrl.PUT_EDIT_PROFILE;
        return axiosClient.put(url, params);
    },
    getCanEditProfile() {
        const url = ApiUrl.GET_CAN_EDIT_PROFILE;
        return axiosClient.get(url);
    },
};

export default authApi;
