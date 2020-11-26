import React from 'react'
import PropTypes from 'prop-types'
import {
    FormGroup,
    FormLabel,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
} from '@material-ui/core'
import Select from 'react-select'

DurationInfo.propTypes = {}

function DurationInfo(props) {
    const packageTypeArr = [
        { value: 1, label: 'Đăng theo tuần', price: 1000, type: 'tuần' },
        { value: 2, label: 'Đăng theo tháng', price: 3000, type: 'tháng' },
        { value: 3, label: 'Đăng theo quý', price: 11000, type: 'quý' },
        { value: 4, label: 'Đăng theo năm', price: 33000, type: 'năm' },
    ]
    const [packageType, setPackageType] = React.useState(packageTypeArr[0])
    const [numberOfTime, setNumberOfTime] = React.useState(1)

    const handlePackageChange = (value) => {
        console.log(value)
        setPackageType(value)
    }
    const handleNumberTimeChange = (value) => {
        setNumberOfTime(value.target.value)
        //console.log(value.target.value)
    }
    return (
        <div class="card">
            <h5 class="card-header">Lịch đăng tin</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel>Gói tin</FormLabel>
                    <Select
                        options={packageTypeArr}
                        defaultValue={packageTypeArr[0]}
                        onChange={handlePackageChange}
                        name="package"
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Số {packageType.type}</FormLabel>
                    <Input
                        type={'number'}
                        onChange={handleNumberTimeChange}
                        name="numberOfTime"
                    />
                </FormGroup>
                <Table>
                    <TableHead>
                        <TableCell>Đơn giá</TableCell>
                        <TableCell>Số {packageType.type}</TableCell>
                        <TableCell>Thành tiền</TableCell>
                    </TableHead>
                    <TableBody>
                        <TableCell>{packageType.price}</TableCell>
                        <TableCell>{numberOfTime}</TableCell>
                        <TableCell>
                            {numberOfTime * Number(packageType.price)}
                        </TableCell>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DurationInfo
