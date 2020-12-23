import * as Yup from 'yup';
import errorMessage from '../../utils/ErrorMessage';

const ownerRegisterValidationSchema = Yup.object().shape({
    username: Yup.string()
        .required(errorMessage.require)
        .min(3, errorMessage.min(3)),
    name: Yup.string()
        .required(errorMessage.require)
        .min(3, errorMessage.min(3)),
    email: Yup.string()
        .required(errorMessage.require)
        .email(errorMessage.email),
    address: Yup.string()
        .required(errorMessage.require)
        .min(3, errorMessage.min(3)),
    identification: Yup.number()
        .required(errorMessage.require)
        .min(8, errorMessage.min(8)),
    phone: Yup.number()
        .required(errorMessage.require)
        .min(7, errorMessage.min(7)),
});

export default ownerRegisterValidationSchema;
