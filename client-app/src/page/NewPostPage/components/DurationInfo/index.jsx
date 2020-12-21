import React from 'react';
import PropTypes from 'prop-types';
import {
    FormGroup,
    FormLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
} from '@material-ui/core';
import Select from 'react-select';
import MySelect from '../../../../share/components/select';
import { DebounceInput } from 'react-debounce-input';
import authApi from '../../../../api/authApi';
import { useSelector } from 'react-redux';
import { isDisplayByRole } from '../../../../helper/auth';
import Role from '../../../../models/data/role';

DurationInfo.propTypes = {};

function DurationInfo(props) {
    const role = useSelector((state) => state.user.role);
    const {
        errors,
        touched,
        defaultValue,
        values,
        handleChange,
        setFieldTouched,
        setFieldValue,
    } = props;
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
    const type = values.packageType ? values.packageType.type : '';
    const price = values.packageType ? values.packageType.price : 0;
    const time = values.numberOfTime ? values.numberOfTime : 1;
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
        <div class="card mt-4">
            <h5 class="card-header">Lịch đăng tin</h5>
            <div class="card-body">
                <FormGroup
                    style={{ display: isDisplayByRole([Role.ADMIN], role) }}
                >
                    <FormLabel>Chọn chủ trọ</FormLabel>
                    <MySelect
                        name="owner"
                        options={ownerArr}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        values={values.owner}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Gói tin</FormLabel>
                    <MySelect
                        options={packageTypeArr}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        defaultValue={packageTypeArr[0]}
                        name="packageType"
                        values={values.packageType}
                    />
                    {errors.package && touched.package && (
                        <span>{errors.package}</span>
                    )}
                </FormGroup>
                <FormGroup>
                    <FormLabel>Số {type}</FormLabel>
                    <input
                        type={'number'}
                        onChange={handleChange}
                        value={values.numberOfTime}
                        name="numberOfTime"
                        defaultValue={1}
                        className="form-control"
                    />
                    {errors.numberOfTime && touched.numberOfTime && (
                        <span>{errors.numberOfTime}</span>
                    )}
                </FormGroup>
                <Table>
                    <TableHead>
                        <TableCell>Đơn giá</TableCell>
                        <TableCell>Số {type}</TableCell>
                        <TableCell>Thành tiền</TableCell>
                    </TableHead>
                    <TableBody>
                        <TableCell>{price}</TableCell>
                        <TableCell>{time}</TableCell>
                        <TableCell>{time * Number(price)}</TableCell>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default DurationInfo;
