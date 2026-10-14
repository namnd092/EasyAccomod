import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = props => {
    return (
        <footer>
            <div className="width_box">
                <div className="footer row">
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>THUÊ PHÒNG TRỌ</h5>
                        <p>Website cho thuê phòng trọ, nhà trọ nhanh chóng và hiệu quả</p>
                    </div>
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>THÔNG TIN</h5>
                        <Link to="#">Giới thiệu</Link>
                        <Link to="#">Blog</Link>
                        <Link to="#">Chính sách bảo mật</Link>
                        <Link to="#">Quy định sử dụng</Link>
                        <Link to="#">Quy chế hoạt động</Link>
                    </div>
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>HƯỚNG DẪN</h5>
                        <Link to="#">Hướng dẫn đăng tin</Link>
                        <Link to="#">Bảng giá dịch vụ</Link>
                        <Link to="#">Quy định đăng tin</Link>
                        <Link to="#">Liên hệ hỗ trợ</Link>
                    </div>
                    <div className="footer__group col-lg-3 col-md-6 col-sm-12 mt-5">
                        <h5>KẾT NỐI VỚI CHÚNG TÔI</h5>
                        <p><i className="fas fa-phone"></i> Hotline: 0123.456.789</p>
                        <p><i className="fas fa-envelope"></i> Email: timnhatro@gmail.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};


Footer.propTypes = {

};


export default Footer;
