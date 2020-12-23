const ApiUrl = {
    GET_TOKEN: 'api/account/token',
    GET_ACCOUNT_INFO: 'api/account/info',
    OWNER_REGISTER: 'api/Account/OwnerRegister',
    RENTER_REGISTER: 'api/Account/RenterRegister',
    LOG_OUT: 'api/Account/Logout',
    GET_OWNERS: 'api/Admin/Owners',

    GET_ALL_PROVINCE: 'api/Provinces',
    GET_DISTRICT_BY_PROVINCE_ID: (provinceId) =>
        `api/Provinces/${provinceId}/districts`,
    GET_WARD_BY_DISTRICT_ID: (districtId) =>
        `api/Districts/${districtId}/Wards`,
    GET_ALL_ROOM_TYPE: 'api/Accommodations/Types',

    GET_ALL_ROOM_AREA_TYPE: 'api/Accommodations/RoomAreaRanges',
    GET_ALL_KITCHEN_TYPE: 'api/Accommodations/KitchenTypes',
    GET_ALL_ROOM_PAYMENT_TYPE: 'api/Accommodations/PaymentTypes',

    GET_RENTAL_POST: '/api/RentalPosts/Search',
    POST_RENTAL_POST: '/api/RentalPosts',
    GET_RENTAL_POST_INFO: '/api/RentalPosts/Get/',
    POST_COMMENT: '/api/Renter/RentalPost/Comment',
    POST_LIKE_RENTAL_POST: 'api/Renter/RenterPost/Like',
    GET_ALL_FAVORITE_RENTAL_POST: 'api/Renter/RenterPost/Likes',
    POST_REPORT: 'api/Renter/RenterPost/Report',
    GET_ALL_RENTAL_POST_COMMENT: (postId, _limit, _page) =>
        `api/RentalPosts/${postId}/Comments?_limit=${_limit}&_page=${_page}`,
    IS_LIKED: 'api/Renter/RenterPost/IsLiked',
    IS_COMMENTED: 'api/Renter/RenterPost/isCommented',
    IS_REPORTED: 'api/Renter/RenterPost/isReported',
    GET_VIEW: (postId) => `api/RentalPosts/${postId}/Views`,
    GET_LIKE: (postId) => `api/RentalPosts/${postId}/Likes`,

    CLOUDINARY_UPLOAD_URL:
        'https://api.cloudinary.com/v1_1/dsysolkex/image/upload',
};
export default ApiUrl;
