import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
const rentalPost = {
    getPostBySearch(query) {
        const url = ApiUrl.GET_RENTAL_POST + '?' + query;
        console.log(url);
        return axiosClient.get(url);
    },
    postNewPost(data) {
        const url = ApiUrl.rentalPost;
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
            numberOfDay,
            kitchenType,
            ownerId,
            name,
            phone,
            email,
            ownerAddress,
            totalPrice,
        } = data;
        const body = {
            Title: title,
            Content: description,
            AccommodationPictures: accommodationPictures,
            Accommodation: {
                Address: {
                    ProvinceId: province,
                    DistrictId: district,
                    WardId: ward,
                    Street: street,
                    PublicLocationNearby: '',
                },
                AccommodationTypeId: roomType,
                RoomQuantity: roomQuantity,
                PaymentTypeId: '',
                Price: roomPrice,
                RoomAreaRangeId: roomArea,
                LiveWithOwner: liveWithOwner,
                HaveClosedBathroom: closeBathroom,
                HaveWaterHeater: haveWaterHeader,
                KitchenTypeId: kitchenType,
                HaveAirConditioner: haveAirCondition,
                HaveBalcony: haveBalcony,
                IsStateElectricityPrice: waterElectricity === 'normal',
                ElectricityPrice: electricityPrice,
                IsStateWaterPrice: waterElectricity === 'normal',
                WaterPrice: waterPrice,
                RoomOptions: '',
                OwnerId: ownerId || null,
            },
            TimeDisplayed: numberOfDay,
        };
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
};

export default rentalPost;
