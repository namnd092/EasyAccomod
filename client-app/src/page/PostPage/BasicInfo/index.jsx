import React from 'react';
import './style.css';

const yesOrNo = (bool) => {
    return bool ? 'Có' : 'Không';
};
function BasicInfo(props) {
    const { basicInfo } = props;
    const { accommodation, dateAdded, dateExpired, title, owner } = basicInfo;
    return (
        <div style={{ paddingTop: '30px' }}>
            <div class="card">
                <h5 class="card-header">Thông tin</h5>
                <div class="card-body">
                    <table className="tablePostPage">
                        <tbody>
                            <tr>
                                <td className="title">Tiêu đề</td>
                                <td colSpan={7}>{title || ''}</td>
                            </tr>
                            <tr>
                                <td className="title">Địa chỉ</td>
                                <td colSpan={7}>
                                    {accommodation
                                        ? accommodation.address.street +
                                          ', ' +
                                          accommodation.address.ward.name +
                                          ', ' +
                                          accommodation.address.district.name +
                                          ', ' +
                                          accommodation.address.province.name
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Khu vực</td>
                                <td colSpan={7}>
                                    {accommodation
                                        ? accommodation.address
                                              .publicLocationNearby
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Loại tin rao:</td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.accommodationType.name
                                        : ''}
                                </td>
                                <td className="title">Trạng thái</td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.status.name
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Người đăng</td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.owner.name
                                        : ''}
                                </td>
                                <td className="title">Điện thoại</td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.owner.phone
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Diện tích</td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.roomAreaRange.range
                                        : ''}
                                </td>
                                <td className="title">Giá cho thuê:</td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.price +
                                          '/' +
                                          accommodation.paymentType.name
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Ngày cập nhật</td>
                                <td colSpan={3}>
                                    {dateAdded
                                        ? dateAdded
                                              .replace('T00:', ' ')
                                              .substring(
                                                  0,
                                                  dateAdded.length - 6
                                              )
                                        : ''}
                                </td>
                                <td className="title">Ngày hết hạn</td>
                                <td colSpan={3}>
                                    {dateExpired
                                        ? dateExpired
                                              .replace('T00:', ' ')
                                              .substring(
                                                  0,
                                                  dateExpired.length - 6
                                              )
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Chung chủ</td>
                                <td>
                                    {accommodation &&
                                        yesOrNo(accommodation.liveWithOwner)}
                                </td>
                                <td className="title">Phòng tắm khép kín</td>
                                <td>
                                    {accommodation &&
                                        yesOrNo(
                                            accommodation.haveClosedBathroom
                                        )}
                                </td>
                                <td className="title" colSpan={1}>
                                    Kiểu bếp
                                </td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.kitchenType.name
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Ban công</td>
                                <td>
                                    {accommodation &&
                                        yesOrNo(accommodation.haveBalcony)}
                                </td>
                                <td className="title">Điều hòa</td>
                                <td>
                                    {accommodation &&
                                        yesOrNo(
                                            accommodation.haveAirConditioner
                                        )}
                                </td>
                                <td className="title">Tiện ích khác</td>
                                <td colSpan={3}>
                                    {accommodation
                                        ? accommodation.roomOptions
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td className="title">Nóng lạnh</td>
                                <td>
                                    {accommodation &&
                                        yesOrNo(accommodation.haveWaterHeater)}
                                </td>
                                <td className="title" colSpan={1}>
                                    Điện nước
                                </td>
                                <td colSpan={1}>
                                    {accommodation
                                        ? accommodation.isStateElectricityPrice
                                            ? 'Giá dân'
                                            : 'Giá thuê'
                                        : ''}
                                </td>
                                <td className="title">Giá điện</td>
                                <td>
                                    {accommodation &&
                                    !accommodation.isStateElectricityPrice
                                        ? accommodation.electricityPrice
                                        : ''}
                                </td>
                                <td className="title">Giá nước</td>
                                <td>
                                    {accommodation &&
                                    !accommodation.isStateElectricityPrice
                                        ? accommodation.waterPrice
                                        : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BasicInfo;
