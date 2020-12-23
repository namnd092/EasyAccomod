import React from 'react';
import { Form, Formik } from 'formik';
import {
    FormGroup,
    FormLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
} from '@material-ui/core';
import Select from 'react-select';
import rentalPost from '../../../api/rentalPost';
export default function ExtendDuration(props) {
    const { postId } = props;
    const handleSubmit = async () => {
        const numberOfDay = packageType.day * numberOfTime;
        console.log(numberOfDay);
        try {
            const response = await rentalPost.postExtendPeriod(
                postId,
                numberOfDay
            );
            console.log(response);
        } catch (error) {
            console.log(error);
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
        console.log(value);
        setPackageType({ ...value });
    };
    return (
        <div
            class="modal fade"
            id="exampleModalCenter"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div
                        class="modal-header"
                        style={{ backgroundColor: '#F7F7F7' }}
                    >
                        <h5 class="modal-title" id="exampleModalLongTitle">
                            Gia hạn
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <Formik>
                                {({ errors, values, handleChange }) => (
                                    <Form>
                                        <FormGroup>
                                            <FormLabel>Chọn gói tin</FormLabel>
                                            <Select
                                                options={packageTypeArr}
                                                onChange={handlePackageChange}
                                                defaultValue={packageTypeArr[0]}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>Số ngày</FormLabel>
                                            <input
                                                type="number"
                                                values={numberOfTime}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                defaultValue={1}
                                            />
                                        </FormGroup>
                                        <Table style={{ marginTop: '10px' }}>
                                            <TableHead>
                                                <TableCell>Đơn giá</TableCell>
                                                <TableCell>
                                                    Số {packageType.type}
                                                </TableCell>
                                                <TableCell>
                                                    Thành tiền
                                                </TableCell>
                                            </TableHead>
                                            <TableBody>
                                                <TableCell>
                                                    {packageType.price}
                                                </TableCell>
                                                <TableCell>
                                                    {numberOfTime}
                                                </TableCell>
                                                <TableCell>
                                                    {packageType.price *
                                                        numberOfTime}
                                                </TableCell>
                                            </TableBody>
                                        </Table>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <div
                        class="modal-footer"
                        style={{ backgroundColor: '#F7F7F7' }}
                    >
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            onClick={handleSubmit}
                            data-dismiss="modal"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
