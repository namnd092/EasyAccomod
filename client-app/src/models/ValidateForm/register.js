import * as Yup from 'yup';

const ownerRegisterValidationSchema = Yup.object().shape({
    username: Yup.string().required().min(3),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required(),
    name: '',
    email: '',
    address: '',
    identification: '',
    phone: '',
});
const renterRegisterValidationSchema = Yup.object().shape({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
});

export { ownerRegisterValidationSchema, renterRegisterValidationSchema };
