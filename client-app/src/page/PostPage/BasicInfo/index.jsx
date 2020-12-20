import React from 'react';
import './style.css';
import TrTable from '../../../share/components/tr';

function BasicInfo(props) {
    const { basicInfo } = props;
    const { accommodation, dateAdded, dateExpired } = basicInfo;
    return (
        <div class="card">
            <h5 class="card-header">Thông tin</h5>
            <div class="card-body">
                <table className="tablePostPage">
                    <tbody>
                        <tr>
                            <td className="title">Địa chỉ</td>
                            <td colSpan={7}>
                                118/8 Đường Trần Quang Diệu, Phường 14, Quận 3,
                                Hồ Chí Minh
                            </td>
                        </tr>
                        <tr>
                            <td className="title">Khu vực</td>
                            <td colSpan={7}>
                                Cho thuê Phòng trọ Quận 3 - Hồ Chí Minh
                            </td>
                        </tr>
                        <tr>
                            <td className="title">Loại tin rao:</td>
                            <td colSpan={7}>Phòng trọ</td>
                        </tr>
                        <tr>
                            <td className="title">Người đăng</td>
                            <td colSpan={3}>Nguyễn Duy Nam</td>
                            <td className="title">Điện thoại</td>
                            <td colSpan={3}>337470773</td>
                        </tr>
                        <tr>
                            <td className="title">Diện tích</td>
                            <td colSpan={3}>30m2</td>
                            <td className="title">Giá cho thuê:</td>
                            <td colSpan={3}>6.3 triệu/tháng</td>
                        </tr>
                        <tr>
                            <td className="title">Ngày cập nhật</td>
                            <td colSpan={3}>11/12/20 13:58</td>
                            <td className="title">Ngày hết hạn</td>
                            <td colSpan={3}>18/12/20 13:58</td>
                        </tr>
                        <tr>
                            <td className="title">Chung chủ</td>
                            <td>Có</td>
                            <td className="title">Phòng tắm</td>
                            <td>Có</td>
                            <td className="title">Phòng bếp</td>
                            <td>Có</td>
                            <td className="title">Điều hòa</td>
                            <td>Có</td>
                        </tr>
                        <tr>
                            <td className="title">Ban công</td>
                            <td>Có</td>
                            <td className="title">Điện nước</td>
                            <td>Có</td>
                            <td className="title">Tiện ích khác</td>
                            <td colSpan={3}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BasicInfo;
