import React from 'react';
import { Link } from 'react-router-dom';

const group = 'mt-12 px-4 w-full md:w-1/2 lg:w-1/4';
const link = 'my-2.5 flex text-gray-500 hover:text-white';

const Footer = () => {
    return (
        <footer className="bg-[var(--bg-color)] p-5">
            <div className="mx-auto w-[95%] max-w-[1100px]">
                <div className="-mx-4 flex flex-wrap">
                    <div className={group}>
                        <h5 className="text-white">THUÊ PHÒNG TRỌ</h5>
                        <p className="my-2.5 text-gray-500">Website cho thuê phòng trọ, nhà trọ nhanh chóng và hiệu quả</p>
                    </div>
                    <div className={group}>
                        <h5 className="text-white">THÔNG TIN</h5>
                        <Link className={link} to="#">Giới thiệu</Link>
                        <Link className={link} to="#">Blog</Link>
                        <Link className={link} to="#">Chính sách bảo mật</Link>
                        <Link className={link} to="#">Quy định sử dụng</Link>
                        <Link className={link} to="#">Quy chế hoạt động</Link>
                    </div>
                    <div className={group}>
                        <h5 className="text-white">HƯỚNG DẪN</h5>
                        <Link className={link} to="#">Hướng dẫn đăng tin</Link>
                        <Link className={link} to="#">Bảng giá dịch vụ</Link>
                        <Link className={link} to="#">Quy định đăng tin</Link>
                        <Link className={link} to="#">Liên hệ hỗ trợ</Link>
                    </div>
                    <div className={group}>
                        <h5 className="text-white">KẾT NỐI VỚI CHÚNG TÔI</h5>
                        <p className="my-2.5 text-gray-500"><i className="fas fa-phone"></i> Hotline: 0123.456.789</p>
                        <p className="my-2.5 text-gray-500"><i className="fas fa-envelope"></i> Email: timnhatro@gmail.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
