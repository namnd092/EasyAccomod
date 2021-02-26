import * as Yup from 'yup';

const loginValidator = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
    password: Yup.string()
        .required('Mật khẩu không được bỏ trống')
        .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự')
        .matches(
            /\w*(?:[A-Z]+)\w*(?:[\W.]+)\w*/,
            'Mật khẩu phải chứa ít nhất 1 ký tự in hoa và 1 ký tự đặc biệt'
        ),
});

export default loginValidator;
