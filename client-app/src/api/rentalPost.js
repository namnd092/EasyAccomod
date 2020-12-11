import axiosClient from './axiosClient';
import ApiUrl from '../constants/ApiUrl';
const rentalPost = {
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
};

export default rentalPost;
