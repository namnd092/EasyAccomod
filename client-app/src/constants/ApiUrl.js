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
    POST_LIKE_RENTAL_POST: 'api/Renter/RentalPost/Like',
    GET_ALL_FAVORITE_RENTAL_POST: 'api/Renter/RentalPost/Likes',
    POST_REPORT: 'api/Renter/RentalPost/Report',
    GET_ALL_RENTAL_POST_COMMENT: (postId, _limit, _page) =>
        `api/RentalPosts/${postId}/Comments?_limit=${_limit}&_page=${_page}`,
    IS_LIKED: 'api/Renter/RentalPost/IsLiked',
    IS_COMMENTED: 'api/Renter/RentalPost/isCommented',
    IS_REPORTED: 'api/Renter/RentalPost/isReported',
    GET_VIEW: (postId) => `api/RentalPosts/${postId}/Views`,
    GET_LIKE: (postId) => `api/RentalPosts/${postId}/Likes`,
    GET_RENTAL_POSTS_BY_STATUS: 'api/Admin/RentalPosts',
    SET_STATUS_RENTAL_POST: `api/Admin/RentalPost/SetStatus`,
    REQUIRE_EDIT_INFO: 'api/Owner/RequireEditInfo',
    PUT_EDIT_PROFILE: 'api/Owner/EditInfo',
    GET_CAN_EDIT_PROFILE: 'api/Owner/EditInfoStatus',
    GET_EXTEND_RENTAL_POST: 'api/Admin/RentalPosts/ExtendPeriod',
    APPROVE_EXTEND: 'api/Admin/RentalPost/ExtendPeriod/Approve',
    REJECT_EXTEND: 'api/Admin/RentalPost/ExtendPeriod/Reject',
    GET_COMMENT_PENDING: 'api/Admin/PendingComment',
    APPROVE_COMMENT: 'api/Admin/ApproveComment',
    REJECT_COMMENT: 'api/Admin/RejectComment',
    GET_REPORT_POST: 'api/Admin/Report',
    GET_OWNER_RENTAL_POST: 'api/Owner/RentalPosts',
    POST_RESOLVE_REPORT: 'api/Admin/RentalPost/ResolveReport',
    GET_STATUS_OPTION: 'api/RentalPosts/Statuses',
    PUT_OWNER_RENTAL_STATUS: 'api/Owner/Accommodation/SetStatus',
    POST_EXTEND_PERIOD: 'api/Owner/RentalPosts/ExtendPeriod',

    CLOUDINARY_UPLOAD_URL:
        'https://api.cloudinary.com/v1_1/dsysolkex/image/upload',
};
export default ApiUrl;
