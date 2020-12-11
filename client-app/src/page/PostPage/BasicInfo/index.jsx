import React from 'react';
import './style.css';
import TrTable from '../../../share/components/tr';

function BasicInfo(props) {
    return (
        <div class="card">
            <h5 class="card-header">Thông tin</h5>
            <div class="card-body">
                <table className="tablePostPage">
                    <tbody>
                        <TrTable
                            thValue={'Địa chỉ'}
                            tdValue={'63 Lê Đức Thọ'}
                        />
                        <TrTable
                            thValue={'Khu vực'}
                            tdValue={'Gần đại học quốc gia'}
                        />
                        <TrTable thValue={'Loại phòng'} tdValue={'Phòng trọ'} />
                        <TrTable
                            thValue={'Người đăng'}
                            tdValue={'Nguyễn Duy Nam'}
                        />
                        <TrTable thValue={'Điện thoại'} tdValue={'123456789'} />
                        <TrTable thValue={'Diện tích'} tdValue={'25m2'} />
                        <TrTable
                            thValue={'Giá cho thuê'}
                            tdValue={'2.8 triệu/tháng'}
                        />
                        <TrTable
                            thValue={'Ngày cập nhật'}
                            tdValue={'11:11 11/11/1111'}
                        />
                        <TrTable
                            thValue={'Ngày hết hạn'}
                            tdValue={'11:11 11/11/1111'}
                        />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BasicInfo;
