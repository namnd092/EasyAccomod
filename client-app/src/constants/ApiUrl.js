const ApiUrl = {
    GET_TOKEN: 'api/account/token',
    GET_ACCOUNT_INFO: 'api/account/info',

    GET_ALL_PROVINCE: 'api/Provinces',
    GET_DISTRICT_BY_PROVINCE_ID: (provinceId) =>
        `api/Provinces/${provinceId}/districts`,
    GET_WARD_BY_DISTRICT_ID: (districtId) =>
        `api/Districts/${districtId}/Wards`,
    GET_ALL_ROOM_TYPE: 'api/Accommodations/Types',

    GET_ALL_ROOM_AREA_TYPE: 'api/Accommodations/RoomAreaRanges',
    GET_ALL_KITCHEN_TYPE: 'api/Accommodations/KitchenTypes',
    GET_ALL_ROOM_PAYMENT_TYPE: 'api/Accommodations/PaymentTypes',

    POST_RENTAL_POST: '/api/RentalPosts',
};
export default ApiUrl;
