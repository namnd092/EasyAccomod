import React from 'react';
import Select from 'react-select';
import rentalPost from '../../../api/rentalPost';
import { Button, FormGroup, FormLabel, Modal, inputClass, tableClass } from '../../../ui';
import { notifyError } from '../../../helper/notify';
export default function ExtendDuration(props) {
    const { postId, open, onClose } = props;
    const handleSubmit = async () => {
        const numberOfDay = packageType.day * numberOfTime;
        try {
            await rentalPost.postExtendPeriod(
                postId,
                numberOfDay
            );
        } catch (error) {
            notifyError(error);
        } finally {
            onClose();
        }
    };
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
    const [packageType, setPackageType] = React.useState({
        value: 1,
        label: 'Đăng theo tuần',
        price: 1000,
        type: 'tuần',
        day: 7,
    });
    const [numberOfTime, setNumberOfTime] = React.useState(1);
    const handleInputChange = (value) => {
        setNumberOfTime(value.target.value);
    };
    const handlePackageChange = (value) => {
        setPackageType({ ...value });
    };
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Gia hạn"
            footer={
                <>
                    <Button variant="neutral" onClick={onClose}>
                        <i className="fas fa-ban"></i> Hủy
                    </Button>
                    <Button onClick={handleSubmit}>
                        <i className="fas fa-check-circle"></i> Xác nhận
                    </Button>
                </>
            }
        >
            <FormGroup>
                <FormLabel>Chọn gói tin</FormLabel>
                <Select
                    options={packageTypeArr}
                    onChange={handlePackageChange}
                    defaultValue={packageTypeArr[0]}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Số {packageType.type}</FormLabel>
                <input
                    type="number"
                    value={numberOfTime}
                    onChange={handleInputChange}
                    className={inputClass}
                />
            </FormGroup>
            <table className={`${tableClass} mt-2.5`}>
                <thead>
                    <tr>
                        <th>Đơn giá</th>
                        <th>Số {packageType.type}</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{packageType.price}</td>
                        <td>{numberOfTime}</td>
                        <td>{packageType.price * numberOfTime}</td>
                    </tr>
                </tbody>
            </table>
        </Modal>
    );
}
