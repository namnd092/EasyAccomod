import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

const Footer = (props) => {
    return (
        <footer>
            <div className="width_box">
                <div className="footer row">
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>THUÊ PHÒNG TRỌ</h5>
                        <p>
                            Website cho thuê phòng trọ, nhà trọ nhanh chóng và
                            hiệu quả
                        </p>
                    </div>
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>THÔNG TIN</h5>
                        <Link>Giới thiệu</Link>
                        <Link>Blog</Link>
                        <Link>Chính sách bảo mật</Link>
                        <Link>Quy định sử dụng</Link>
                        <Link>Quy chế hoạt động</Link>
                    </div>
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>HƯỚNG DẪN</h5>
                        <Link>Hướng dẫn đăng tin</Link>
                        <Link>Bảng giá dịch vụ</Link>
                        <Link>Quy định đăng tin</Link>
                        <Link>Liên hệ hỗ trợ</Link>
                    </div>
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>KẾT NỐI VỚI CHÚNG TÔI</h5>
                        <p>
                            <i class="fas fa-phone"></i> Hotline: 0123.456.789
                        </p>
                        <p>
                            <i class="fas fa-envelope"></i> Email:
                            timnhatro@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

Footer.propTypes = {};

export default Footer;
