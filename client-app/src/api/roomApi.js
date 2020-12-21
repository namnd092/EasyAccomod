import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
const roomApi = {
    getAllRoomAreaType() {
        const url = ApiUrl.GET_ALL_ROOM_AREA_TYPE;
        return axiosClient.get(url);
    },
    getAllKitchenType() {
        const url = ApiUrl.GET_ALL_KITCHEN_TYPE;
        return axiosClient.get(url);
    },
    getAllRoomType() {
        const url = ApiUrl.GET_ALL_ROOM_TYPE;
        return axiosClient.get(url);
    },
    getAllPaymentType() {
        const url = ApiUrl.GET_ALL_ROOM_PAYMENT_TYPE;
        return axiosClient.get(url);
    },
};

export default roomApi;
