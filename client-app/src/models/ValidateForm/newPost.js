import * as Yup from 'yup';
import errorMessage from './../../utils/ErrorMessage';

const newPostValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required(errorMessage.require)
        .min(30, 'Tiêu đề phải dài ít nhất 30 ký tự'),
    roomType: Yup.object().required(errorMessage.require),
    province: Yup.object().required(errorMessage.require),
    street: Yup.string().required(errorMessage.require),
    roomPrice: Yup.number()
        .required(errorMessage.require)
        .min(1, 'Gía tiền của phòng phải lớn hơn 0'),
    roomArea: Yup.object().required(errorMessage.require),
    roomQuantity: Yup.number()
        .required(errorMessage.require)
        .min(1, 'Số lượng phòng phải lớn hơn 0'),
    liveWithOwner: Yup.boolean(),
    closeBathroom: Yup.boolean(),
    haveWaterHeader: Yup.boolean(),
    haveAirCondition: Yup.boolean(),
    haveBalcony: Yup.boolean(),
    waterElectricity: Yup.string().required(errorMessage.require),
    electricityPrice: Yup.number().required(errorMessage.require),
    waterPrice: Yup.number().required(errorMessage.require),
    description: Yup.string()
        .required(errorMessage.require)
        .min(50, 'Mô tả phải có độ dài từ 50 ký tự trở lên'),
    roomImageArr: Yup.array().min(3, 'Phải có ít nhất 3 ảnh'),
    kitchenType: Yup.object().required(errorMessage.require),
    publicLocationNearby: Yup.string().required(errorMessage.require),
    roomOption: Yup.string(),
});

export default newPostValidationSchema;
