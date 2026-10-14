import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
import queryString from 'query-string';

// confirmationStatus values understood by GET api/Admin/Owners.
const OwnerStatus = { PENDING: -1, CONFIRMED: 1, EDIT_REQUIRED: -2 };
const getOwners = (_page, _limit, confirmationStatus) =>
    axiosClient.get(
        ApiUrl.GET_OWNERS + '?' + queryString.stringify({ _page, _limit, confirmationStatus })
    );
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
    getOwnerSuccess: (_page, _limit) => getOwners(_page, _limit, OwnerStatus.CONFIRMED),
    getOwnerRegisterPending: (_page, _limit) => getOwners(_page, _limit, OwnerStatus.PENDING),
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
    getAccountEditRequire: (_page, _limit) => getOwners(_page, _limit, OwnerStatus.EDIT_REQUIRED),
    postSetOwner(accountId) {
        const url = ApiUrl.SET_OWNER;
        return axiosClient.post(url, { accountId });
    },
    postRejectOwner(accountId) {
        const url = ApiUrl.REJECT_OWNER;
        return axiosClient.post(url, { accountId });
    },
    postOwnerCanEditInfo(ownerId, canEditInfo) {
        const url = ApiUrl.SET_REJECT_OWNER_EDIT_INFO;
        return axiosClient.post(url, { ownerId, canEditInfo });
    },
};

export default authApi;
