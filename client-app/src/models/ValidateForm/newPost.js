import * as Yup from 'yup';
import errorMessage from './../../utils/ErrorMessage';

const newPostValidationSchema = Yup.object().shape({
    title: Yup.string().required(errorMessage.require),
    roomType: Yup.string().required(errorMessage.require),
    province: Yup.number().required(errorMessage.require),
    district: Yup.number().required(errorMessage.require),
    ward: Yup.number().required(errorMessage.require),
    street: Yup.string().required(errorMessage.require),
    roomPrice: Yup.number().required(errorMessage.require),
    roomArea: Yup.number().required(errorMessage.require),
    roomQuantity: Yup.number().required(errorMessage.require),
    liveWithOwner: Yup.boolean().required(errorMessage.require),
    closeBathroom: Yup.boolean().required(errorMessage.require),
    haveWaterHeader: Yup.boolean().required(errorMessage.require),
    haveAirCondition: Yup.boolean().required(errorMessage.require),
    haveBalcony: Yup.boolean().required(errorMessage.require),
    waterElectricity: Yup.string().required(errorMessage.require),
    electricityPrice: Yup.number().required(errorMessage.require),
    waterPrice: Yup.number().required(errorMessage.require),
    description: Yup.string().required(errorMessage.require),
    numberOfDay: Yup.number().min(1),
    totalPrice: Yup.number().min(1),
    roomImageArr: Yup.array().min(3),
    kitchenType: Yup.number(),
    publicLocationNearby: null,
});

export default newPostValidationSchema;
