import * as Yup from 'yup';
import errorMessage from '../../utils/ErrorMessage';

const ownerRegisterValidationSchema = Yup.object().shape({
    username: Yup.string()
        .required(errorMessage.require)
        .min(3, errorMessage.min(3)),
    password: Yup.string()
        .required(errorMessage.require)
        .min(6, errorMessage.min(6))
        .matches(/\w*(?:[A-Z]+)\w*(?:[\W.]+)\w*/, errorMessage.password),
    confirmPassword: Yup.string()
        .required(errorMessage.require)
        .oneOf([Yup.ref('password'), null], errorMessage.confirmPassword),
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
const renterRegisterValidationSchema = Yup.object().shape({
    username: Yup.string()
        .required(errorMessage.require)
        .min(3, errorMessage.min(3)),
    password: Yup.string()
        .required(errorMessage.require)
        .min(6, errorMessage.min(6))
        .matches(/\w*(?:[A-Z]+)\w*(?:[\W.]+)\w*/, errorMessage.password),
    confirmPassword: Yup.string()
        .required(errorMessage.require)
        .oneOf([Yup.ref('password'), null], errorMessage.confirmPassword),
    name: Yup.string()
        .required(errorMessage.require)
        .min(3, errorMessage.min(3)),
    email: Yup.string()
        .required(errorMessage.require)
        .email('Chưa đúng định dạng email'),
});

export { ownerRegisterValidationSchema, renterRegisterValidationSchema };
