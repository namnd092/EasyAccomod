import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
import queryString from 'query-string';
const rentalPost = {
    getPostBySearch(query) {
        const url = ApiUrl.GET_RENTAL_POST + '?' + query;
        console.log(url);
        return axiosClient.get(url);
    },
    postNewPost(data) {
        const url = ApiUrl.POST_RENTAL_POST;
        const {
            title,
            description,
            roomType,
            accommodationPictures,
            province,
            district,
            ward,
            street,
            roomPrice,
            roomArea,
            roomQuantity,
            liveWithOwner,
            closeBathroom,
            haveWaterHeader,
            haveAirCondition,
            haveBalcony,
            waterElectricity,
            electricityPrice,
            waterPrice,
            kitchenType,
            publicLocationNearby,
            owner,
            roomPaymentType,
            roomOption,
            packageType,
            numberOfTime,
        } = data;
        const ownerId = owner ? owner.id : 0;
        const body = {
            Title: title,
            Content: description,
            AccommodationPictures: accommodationPictures,
            Accommodation: {
                Address: {
                    ProvinceId: province.value,
                    DistrictId: district.value,
                    WardId: ward.value,
                    Street: street,
                    PublicLocationNearby: publicLocationNearby,
                },
                AccommodationTypeId: roomType.value,
                RoomQuantity: roomQuantity,
                PaymentTypeId: roomPaymentType.value,
                Price: roomPrice,
                RoomAreaRangeId: roomArea.value,
                LiveWithOwner: liveWithOwner,
                HaveClosedBathroom: closeBathroom,
                HaveWaterHeater: haveWaterHeader,
                KitchenTypeId: kitchenType.value,
                HaveAirConditioner: haveAirCondition,
                HaveBalcony: haveBalcony,
                IsStateElectricityPrice: waterElectricity === 'normal',
                ElectricityPrice: electricityPrice,
                IsStateWaterPrice: waterElectricity === 'normal',
                WaterPrice: waterPrice,
                RoomOptions: roomOption,
                OwnerId: ownerId,
            },
            TimeDisplayed: Number(packageType.day) * Number(numberOfTime),
        };
        console.log(body);
        return axiosClient.post(url, body);
    },
    getRentalPostInfo(id) {
        const url = ApiUrl.GET_RENTAL_POST_INFO + id;
        return axiosClient.get(url);
    },
    postComment(params) {
        const url = ApiUrl.POST_COMMENT;
        return axiosClient.post(url, params);
    },
    getAllCommentByPostId(postId, _limit, _page) {
        const url = ApiUrl.GET_ALL_RENTAL_POST_COMMENT(postId, _limit, _page);
        return axiosClient.get(url);
    },
    getViews(postId) {
        const url = ApiUrl.GET_VIEW(postId);
        return axiosClient.get(url);
    },
    getLikes(postId) {
        const url = ApiUrl.GET_LIKE(postId);
        return axiosClient.get(url);
    },
    getRenterIsLikeRentalPost(postId) {},
    postRenterLikeRentalPost(postId) {
        const url = ApiUrl.POST_LIKE_RENTAL_POST;
        return axiosClient.post(url, { AccommodationRentalPostId: postId });
    },
    getAllFavoriteRentalPost() {
        const url = ApiUrl.GET_ALL_FAVORITE_RENTAL_POST;
        return axiosClient.get(url);
    },
    postReport(params) {
        const url = ApiUrl.POST_REPORT;
        return axiosClient.post(url, params);
    },
    isLiked(postId) {
        const url = ApiUrl.IS_LIKED + '?postId=' + postId;
        return axiosClient.get(url);
    },
    isCommented(postId) {
        const url = ApiUrl.IS_COMMENTED + '?postId=' + postId;
        return axiosClient.get(url);
    },
    isReported(postId) {
        const url = ApiUrl.IS_REPORTED + '?postId=' + postId;
        return axiosClient.get(url);
    },
    getRentalPost(_page, _limit, statusId) {
        const url =
            ApiUrl.GET_RENTAL_POSTS_BY_STATUS +
            `?_page=${_page}&_limit=${_limit}&statusId=${statusId}`;
        return axiosClient.get(url);
    },
    setStatusRentalPost(id, postId) {
        const url = ApiUrl.SET_STATUS_RENTAL_POST;
        return axiosClient.put(url, { id, postId });
    },
    getExtendRentalPost(_page, _limit) {
        const url =
            ApiUrl.GET_EXTEND_RENTAL_POST + `?_page=${_page}&_limit=${_limit}`;
        return axiosClient.get(url);
    },
    postApproveExtend(extendId) {
        const url = ApiUrl.APPROVE_EXTEND;
        return axiosClient.post(url, { extendId });
    },
    postRejectExtend(extendId) {
        const url = ApiUrl.REJECT_EXTEND;
        return axiosClient.post(url, { extendId });
    },
    getCommendPending() {
        const url = ApiUrl.GET_COMMENT_PENDING;
        return axiosClient.get(url);
    },
    postApproveComment(id) {
        const url = ApiUrl.APPROVE_COMMENT;
        return axiosClient.post(url, { id });
    },
    postRejectComment(id) {
        const url = ApiUrl.REJECT_COMMENT;
        return axiosClient.post(url, { id });
    },
    getReportPost() {
        const url = ApiUrl.GET_REPORT_POST;
        return axiosClient.get(url);
    },
    getOwnerRentalPost(_page, _limit, statusId, isExpired, wasRented) {
        const url =
            ApiUrl.GET_OWNER_RENTAL_POST +
            '?' +
            queryString.stringify({ _page, _limit, statusId });
        return axiosClient.get(url);
    },
    postResolveReport(id) {
        const url = ApiUrl.POST_RESOLVE_REPORT;
        return axiosClient.post(url, { id });
    },
    getStatusOptions() {
        const url = ApiUrl.GET_STATUS_OPTION;
        return axiosClient.get(url);
    },
    putOwnerSetRentalStatus() {
        const url = ApiUrl.PUT_OWNER_RENTAL_STATUS;
        return axiosClient.put(url);
    },
    postExtendPeriod(accommodationRentalPostId, extendPeriod) {
        const url = ApiUrl.POST_EXTEND_PERIOD;
        return axiosClient.post(url, {
            accommodationRentalPostId,
            extendPeriod,
        });
    },
};

export default rentalPost;
