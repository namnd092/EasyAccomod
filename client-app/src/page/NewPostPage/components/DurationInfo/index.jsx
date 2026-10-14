import React from 'react';
import { useWatch } from 'react-hook-form';
import { SelectField, InputField } from '../../../../share/components/form-fields';
import authApi from '../../../../api/authApi';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../../helper/auth';
import Role from '../../../../models/data/role';
import { tableClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../../ui';

function DurationInfo() {
    const role = useSelector((state) => state.user.role);
    const packageType = useWatch({ name: 'packageType' });
    const numberOfTime = useWatch({ name: 'numberOfTime' });
    const packageTypeArr = [
        {
            value: 1,
            label: 'Đăng theo tuần',
            price: 1000,
            type: 'tuần',
            day: 7,
        },
        {
            value: 2,
            label: 'Đăng theo tháng',
            price: 3000,
            type: 'tháng',
            day: 30,
        },
        {
            value: 3,
            label: 'Đăng theo quý',
            price: 11000,
            type: 'quý',
            day: 90,
        },
        {
            value: 4,
            label: 'Đăng theo năm',
            price: 33000,
            type: 'năm',
            day: 365,
        },
    ];
    const [ownerArr, setOwnerArr] = React.useState([]);
    const type = packageType ? packageType.type : '';
    const price = packageType ? packageType.price : 0;
    const time = numberOfTime ? numberOfTime : 1;
    React.useEffect(() => {
        async function getOwnerArr() {
            try {
                const response = await authApi.getOwnerSuccess(1, 15);
                const owners = await response.owners;
                console.log(response);
                setOwnerArr(
                    [...owners].map((e) => ({
                        value: e.id,
                        label: `Tên: ${e.name} - CMND: ${e.identification} - Phone: ${e.phone}`,
                        ...e,
                    }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        getOwnerArr();
    }, []);
    return (
        <div className={`${cardClass} mt-6`}>
            <h5 className={cardHeaderClass}>Lịch đăng tin</h5>
            <div className={cardBodyClass}>
                <div style={{ display: isDisplayByRole([Role.ADMIN], role) }}>
                    <SelectField label="Chọn chủ trọ" name="owner" options={ownerArr} />
                </div>
                <SelectField label="Gói tin" name="packageType" options={packageTypeArr} />
                <InputField label={`Số ${type}`} name="numberOfTime" type="number" />
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th>Đơn giá</th>
                            <th>Số {type}</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{price}</td>
                            <td>{time}</td>
                            <td>{time * Number(price)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DurationInfo;
