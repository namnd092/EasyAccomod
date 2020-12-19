import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../../share/components/card';

DescriptionInfo.propTypes = {};

function DescriptionInfo(props) {
    return (
        <div>
            <Card title="Mô tả">
                <p>
                    Cho thuê căn hộ mini cao cấp 30m2, giá 2.5 triệu - 3
                    triệu/tháng. Có thang máy, giờ tự do, có bảo vệ 24/24. Có
                    Wifi, máy nước nóng, trường hình cáp. Địa chỉ: 796 Lê Đức
                    Thọ, Phường 15, Quận Gò Vấp, Tp. Hồ Chí Minh. Liên hệ:
                    0328837249 Chị Giang.
                    --------------------------------------------- ☎️ Điện thoại
                    liên hệ: 0328837249
                </p>
            </Card>
        </div>
    );
}

export default DescriptionInfo;
