import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
const addressApi = {
    getAllProvince() {
        const url = ApiUrl.GET_ALL_PROVINCE;
        return axiosClient.get(url);
    },
    getDistrictByProvinceId(provinceId) {
        const url = ApiUrl.GET_DISTRICT_BY_PROVINCE_ID(provinceId);
        return axiosClient.get(url);
    },
    getWardByDistrictID(districtId) {
        const url = ApiUrl.GET_WARD_BY_DISTRICT_ID(districtId);
        return axiosClient.get(url);
    },
};

export default addressApi;
