import React from 'react'
import PropTypes from 'prop-types'
import { Field, Form, Formik } from 'formik'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@material-ui/core'
import {
    Button,
    FormGroup,
    FormLabel,
    Input,
    TextField,
} from '@material-ui/core'
import Select from 'react-select'
import { useState } from 'react'

SearchFrom.propTypes = {
    onSumbit: PropTypes.func,
}

SearchFrom.defaultProps = {
    onSumbit: null,
}

function SearchFrom(props) {
    const initialValues = {
        province: null,
        town: null,
        village: null,
        street: null,
        roomPrice: null,
        roomArea: null,
        roomQuantity: null,
        haveKitchen: 0,
        haveAirConditioner: 0,
        haveBalcony: 0,
        haveClosedBathroom: null,
        haveWaterHeater: null,
        waterPrice: null,
        electricityPrice: null,
        liveWithOwner: null,
    }
    const provinceArr = [
        { value: 0, label: 'Tỉnh/Thành Phố' },
        { value: 1, label: 'Bắc Giang' },
        { value: 2, label: 'Bắc Ninh' },
        { value: 3, label: 'Hưng Yên' },
        { value: 4, label: 'Hà Nội' },
        { value: 5, label: 'Đà Nẵng' },
        { value: 6, label: 'Tp HCM' },
    ]
    const roomPriceArr = [
        { value: 'all', label: 'Mức giá' },
        { value: '_1', label: 'Dưới 1 triệu' },
        { value: '1_2', label: '1 triệu - 2 triệu' },
        { value: '2_3', label: '2 triệu - 3 triệu' },
        { value: '3_5', label: '3 triệu - 5 triệu' },
        { value: '5_7', label: '5 triệu - 7 triệu' },
        { value: '7_10', label: '7 triệu - 10 triệu' },
        { value: '10_15', label: '10 triệu - 15 triệu' },
        { value: '15_20', label: '15 triệu - 20 triệu' },
        { value: '20_', label: 'Trên 20 triệu' },
    ]
    const roomAreaArr = [
        { value: 'all', label: 'Diện tích' },
        { value: '_20', label: 'Dưới 20m2' },
        { value: '20_30', label: '20m2 - 30m2' },
        { value: '30_40', label: '30m2 - 40m2' },
        { value: '40_50', label: '40m2 - 50m2' },
        { value: '50_60', label: '50m2 - 60m2' },
        { value: '60_70', label: '60m2 - 70m2' },
        { value: '70_80', label: '70m2 - 80m2' },
        { value: '80_90', label: '80m2 - 90m2' },
        { value: '90_100', label: '90m2 - 100m2' },
        { value: '100_', label: 'Trên 100m2' },
    ]
    const choseData = [
        { value: 0, label: 'Tất cả' },
        { value: 1, label: 'Có' },
        { value: -1, label: 'Không' },
    ]
    const [filterValues, setFilterValues] = useState({
        province: 0,
        town: 0,
        village: 0,
        street: null,
        roomPrice: 0,
        roomArea: 0,
        roomType: 0,
        haveKitchen: 0,
        haveAirConditioner: 0,
        haveBalcony: 0,
        haveClosedBathroom: 0,
        haveWaterHeater: 0,
        waterPrice: 0,
        electricityPrice: 0,
        liveWithOwner: 0,
    })
    const [provinceData, setProvinceData] = useState(provinceArr)
    const [townData, setTownData] = useState([])
    const [villageData, setVillageData] = useState([])
    const [roomTypeData, setRoomTypeData] = useState([])

    const handleSubmit = (value) => {
        props.onSubmit(filterValues)
    }
    const handleProvinceChange = (value) => {
        setFilterValues({
            ...filterValues,
            province: value.value,
        })
        console.log(value)
    }
    const handleTownChange = (value) => {
        setFilterValues({
            ...filterValues,
            town: value.value,
        })
        console.log(value)
    }

    return (
        <Formik
            onSubmit={(value) => handleSubmit(value)}
            initialValues={initialValues}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <Form>
                    <div className="row">
                        <div className="col-10">
                            <Accordion expanded={true}>
                                <AccordionSummary>
                                    <h2>Tìm kiếm cơ bản</h2>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ width: '100%' }}>
                                        <div className="row">
                                            <FormGroup className="col-3">
                                                <FormLabel>
                                                    Loại Phòng
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        roomTypeData[0]
                                                    }
                                                    options={roomTypeData}
                                                    name="roomType"
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            roomType:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-3">
                                                <FormLabel>
                                                    Tỉnh/Thành phố
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        provinceArr[0]
                                                    }
                                                    options={provinceArr}
                                                    name="province"
                                                    onChange={(value) =>
                                                        handleProvinceChange(
                                                            value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-3">
                                                <FormLabel>
                                                    Quận/Huyện
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        provinceArr[0]
                                                    }
                                                    options={provinceArr}
                                                    name="town"
                                                    onChange={(value) =>
                                                        handleTownChange(value)
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-3">
                                                <FormLabel>Xã/Phường</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        provinceArr[0]
                                                    }
                                                    options={provinceArr}
                                                    name="village"
                                                    onChange={(value) =>
                                                        console.log(value)
                                                    }
                                                />
                                            </FormGroup>
                                        </div>

                                        <div className="row">
                                            <FormGroup className="col-6">
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Địa chỉ chi tiết"
                                                    variant="outlined"
                                                    name="street"
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            street:
                                                                value.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-3">
                                                <FormLabel>Mức giá</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        roomPriceArr[0]
                                                    }
                                                    options={roomPriceArr}
                                                    name="roomPrice"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            roomPrice:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-3">
                                                <FormLabel>Diện tích</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        roomAreaArr[0]
                                                    }
                                                    options={roomAreaArr}
                                                    name="roomArea"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            roomArea:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary>
                                    <h2>Tìm kiếm chi tiết</h2>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{width: '100%'}}>
                                        <div className="row">
                                            <FormGroup className="col-2">
                                                <FormLabel>Chung chủ</FormLabel>
                                                <Select
                                                    defaultValue={choseData[0]}
                                                    options={choseData}
                                                    name="liveWithOwner"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            liveWithOwner:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-2">
                                                <FormLabel>Nóng lạnh</FormLabel>
                                                <Select
                                                    defaultValue={choseData[0]}
                                                    options={choseData}
                                                    name="haveWaterHeater"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            haveWaterHeater:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-2">
                                                <FormLabel>Ban công</FormLabel>
                                                <Select
                                                    defaultValue={choseData[0]}
                                                    options={choseData}
                                                    name="haveBalcony"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            haveBalcony:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-2">
                                                <FormLabel>Điều hòa</FormLabel>
                                                <Select
                                                    defaultValue={choseData[0]}
                                                    options={choseData}
                                                    name="haveAirConditioner"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            haveAirConditioner:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-2">
                                                <FormLabel>
                                                    Nhà tắm riêng
                                                </FormLabel>
                                                <Select
                                                    defaultValue={choseData[0]}
                                                    options={choseData}
                                                    name="haveClosedBathroom"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            haveClosedBathroom:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-2">
                                                <FormLabel>Bếp riêng</FormLabel>
                                                <Select
                                                    defaultValue={choseData[0]}
                                                    options={choseData}
                                                    name="haveKitchen"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            haveKitchen:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className="col-2">
                            <Button
                                type={'submit'}
                                color={'primary'}
                                variant="contained"
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default SearchFrom
