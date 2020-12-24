const errorMessage = {
    require: 'Bạn không được bỏ trống trường này !',
    min: (int) => `Trường này phải có ít nhất ${int} ký tự`,
    max: (int) => `Trường này chứa tối đa ${int} ký tự`,
    password: 'Mật khẩu phải chứa ít nhất 1 ký tự in hoa và 1 ký tự đặc biệt',
    confirmPassword: 'Mật khẩu nhập lại chưa đúng',
    email: 'Chưa đúng định dạng email',
};

export default errorMessage;
