import React from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@material-ui/core';
import {
    Button,
    FormGroup,
    FormLabel,
    TextField,
} from '@material-ui/core';
import Select from 'react-select';
import { useState } from 'react';
import addressApi from '../../../../api/addressApi';
import roomApi from '../../../../api/roomApi';

SearchFrom.propTypes = {
    onSumbit: PropTypes.func,
};

SearchFrom.defaultProps = {
    onSumbit: null,
};

function SearchFrom(props) {
    const initialValues = {
        province: null,
        town: null,
        ward: null,
        street: null,
        roomPrice: 0,
        roomArea: 0,
        roomQuantity: null,
        haveKitchen: 0,
        haveAirConditioner: 0,
        haveBalcony: 0,
        haveClosedBathroom: 0,
        haveWaterHeater: 0,
        waterPrice: null,
        electricityPrice: null,
        liveWithOwner: 0,
    };
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
    ];
    const choseData = [
        { value: 0, label: 'Tất cả' },
        { value: 1, label: 'Có' },
        { value: -1, label: 'Không' },
    ];
    const defaultData = [{ value: 0, label: 'Tất cả' }];
    const [filterValues, setFilterValues] = useState({
        province: 0,
        district: 0,
        ward: 0,
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
    });
    const [provinceData, setProvinceData] = useState([defaultData]);
    const [districtData, setDistrictData] = useState([defaultData]);
    const [wardData, setWardData] = useState([defaultData]);
    const [roomTypeData, setRoomTypeData] = useState([defaultData]);
    const [roomAreaData, setRoomAreaData] = useState([defaultData]);
    const [kitchenTypeData, setKitchenTypeData] = useState([defaultData]);

    React.useEffect(() => {
        async function effectGetRoomAreaData() {
            try {
                const response = await roomApi.getAllRoomAreaType();
                setRoomAreaData(
                    defaultData.concat(
                        [...response].map((e) => ({
                            value: e.id,
                            label: e.range,
                        }))
                    )
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetRoomAreaData();

        async function effectGetRoomType() {
            try {
                const response = await roomApi.getAllRoomType();
                setRoomTypeData(
                    defaultData.concat(
                        [...response].map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))
                    )
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetRoomType();

        async function effectGetProvinceData() {
            try {
                const response = await addressApi.getAllProvince();
                setProvinceData(
                    defaultData.concat(
                        [...response].map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))
                    )
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetProvinceData();

        async function effectGetKitchenType() {
            try {
                const response = await roomApi.getAllKitchenType();
                console.log(response);
                setKitchenTypeData(
                    defaultData.concat(
                        [...response].map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))
                    )
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetKitchenType();
    }, []);

    const handleProvinceChange = async (value) => {
        const provinceId = value.value;
        console.log(provinceId);
        setFilterValues({
            ...filterValues,
            province: provinceId,
            district: 0,
            ward: 0,
        });
        try {
            if (provinceId === 0) {
                setDistrictData(defaultData);
            } else {
                const response = await addressApi.getDistrictByProvinceId(
                    provinceId
                );
                setDistrictData(
                    defaultData.concat(
                        [...response].map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))
                    )
                );
            }
            setWardData(defaultData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDistrictChange = async (value) => {
        const districtId = value.value;
        setFilterValues({
            ...filterValues,
            district: districtId,
            ward: 0,
        });
        try {
            if (districtId === 0) {
                setWardData(defaultData);
            } else {
                const response = await addressApi.getWardByDistrictID(
                    districtId
                );
                setWardData(
                    defaultData.concat(
                        [...response].map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (value) => {
        props.onSubmit(filterValues);
    };

    return (
        <Formik
            onSubmit={(value) => handleSubmit(value)}
            initialValues={initialValues}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <Form>
                    <div className="row">
                        <div className="col-12 col-lg-10">
                            <Accordion expanded={true}>
                                <AccordionSummary>
                                    <h2>Tìm kiếm cơ bản</h2>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ width: '100%' }}>
                                        <div className="row">
                                            <FormGroup className="col-12 col-md-6 col-xl-3">
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
                                            <FormGroup className="col-12 col-md-6 col-xl-3">
                                                <FormLabel>
                                                    Tỉnh/Thành phố
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        provinceData[0]
                                                    }
                                                    value={
                                                        provinceData.find(
                                                            (e) =>
                                                                e.value ===
                                                                filterValues.province
                                                        )
                                                    }
                                                    options={provinceData}
                                                    name="province"
                                                    onChange={(value) =>
                                                        handleProvinceChange(
                                                            value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-3">
                                                <FormLabel>
                                                    Quận/Huyện
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        filterValues.district
                                                    }
                                                    value={
                                                        districtData.find(
                                                            (e) =>
                                                                e.value ===
                                                                filterValues.district
                                                        )
                                                    }
                                                    options={districtData}
                                                    name="district"
                                                    onChange={(value) =>
                                                        handleDistrictChange(
                                                            value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-3">
                                                <FormLabel>Xã/Phường</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        filterValues.ward
                                                    }
                                                    value={
                                                        wardData.find(
                                                            (e) =>
                                                                e.value ===
                                                                filterValues.ward
                                                        )
                                                    }
                                                    options={wardData}
                                                    name="ward"
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            ward: value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                        </div>

                                        <div className="row">
                                            <FormGroup className="col-12 col-xl-6 mt-3">
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Đường/Số nhà"
                                                    variant="outlined"
                                                    name="street"
                                                    onBlur={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            street:
                                                                value.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-3">
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
                                            <FormGroup className="col-12 col-md-6 col-xl-3">
                                                <FormLabel>Diện tích</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        roomAreaData[0]
                                                    }
                                                    options={roomAreaData}
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
                                    <div style={{ width: '100%' }}>
                                        <div className="row">
                                            <FormGroup className="col-12 col-md-6 col-lg-4 col-xl-2">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4 col-xl-2">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4 col-xl-2">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4 col-xl-2">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4 col-xl-2">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4 col-xl-2">
                                                <FormLabel>Bếp riêng</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        kitchenTypeData[0]
                                                    }
                                                    options={kitchenTypeData}
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
                        <div className="col-lg-2 col-12">
                            <Button
                                type={'submit'}
                                color={'secondary'}
                                variant="contained"
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default SearchFrom;
