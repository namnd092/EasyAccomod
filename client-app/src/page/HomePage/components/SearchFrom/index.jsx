import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { Form, Formik } from 'formik';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    InputBase,
    makeStyles,
} from '@material-ui/core';
import { Button, FormGroup, FormLabel, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));
function SearchFrom(props) {
    const classes = useStyles();
    const { isLoading } = props;
    const initialValues = {
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        street: '',
        publicLocationNearby: '',
        accommodationTypeId: 0,
        paymentTypeId: 0,
        minPrice: 0,
        maxPrice: 0,
        roomAreaRangeId: 0,
        kitchenTypeId: 0,
        haveAirConditioner: 0,
        haveBalcony: 0,
        haveClosedBathroom: 0,
        haveWaterHeater: 0,
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
    const [filterValues, setFilterValues] = useState(initialValues);
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
        setFilterValues({
            ...filterValues,
            provinceId,
            districtId: 0,
            wardId: 0,
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
            districtId,
            wardId: 0,
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

    const handleRoomPriceChange = (value) => {
        const roomPriceString = value.value;
        if (roomPriceString === 'all') {
            setFilterValues({ ...filterValues, minPrice: 0, maxPrice: 0 });
            return;
        }
        const roomPriceArray = roomPriceString.split('_').map((e) => Number(e));
        const [minPrice, maxPrice] = roomPriceArray;
        setFilterValues({ ...filterValues, minPrice, maxPrice });
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
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={
                                        <ExpandMoreIcon fontSize={'large'} />
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <h2>Tìm kiếm cơ bản</h2>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ width: '100%' }}>
                                        <div className="row">
                                            <FormGroup className="col-12 col-md-6 col-xl-4">
                                                <FormLabel>
                                                    Tỉnh/Thành phố
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        provinceData[0]
                                                    }
                                                    value={provinceData.find(
                                                        (e) =>
                                                            e.value ===
                                                            filterValues.provinceId
                                                    )}
                                                    options={provinceData}
                                                    name="provinceId"
                                                    onChange={(value) =>
                                                        handleProvinceChange(
                                                            value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-4">
                                                <FormLabel>
                                                    Quận/Huyện
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        filterValues.districtId
                                                    }
                                                    value={districtData.find(
                                                        (e) =>
                                                            e.value ===
                                                            filterValues.districtId
                                                    )}
                                                    options={districtData}
                                                    name="districtId"
                                                    onChange={(value) =>
                                                        handleDistrictChange(
                                                            value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-4">
                                                <FormLabel>Xã/Phường</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        filterValues.wardId
                                                    }
                                                    value={wardData.find(
                                                        (e) =>
                                                            e.value ===
                                                            filterValues.wardId
                                                    )}
                                                    options={wardData}
                                                    name="wardId"
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            wardId: value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-4">
                                                <FormLabel>
                                                    Loại Phòng
                                                </FormLabel>
                                                <Select
                                                    defaultValue={
                                                        roomTypeData[0]
                                                    }
                                                    options={roomTypeData}
                                                    name="accommodationTypeId"
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            accommodationTypeId:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-4">
                                                <FormLabel>Mức giá</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        roomPriceArr[0]
                                                    }
                                                    options={roomPriceArr}
                                                    name="roomPrice"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        handleRoomPriceChange(
                                                            value
                                                        )
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-12 col-md-6 col-xl-4">
                                                <FormLabel>Diện tích</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        roomAreaData[0]
                                                    }
                                                    options={roomAreaData}
                                                    name="roomAreaRangeId"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            roomAreaRangeId:
                                                                value.value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                        </div>

                                        <div className="row">
                                            <FormGroup className="col-12 col-lg-6">
                                                <FormLabel>
                                                    Đường/Số nhà
                                                </FormLabel>
                                                <input
                                                    label="Đường/Số nhà"
                                                    variant="outlined"
                                                    name="street"
                                                    className="form-control"
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
                                            <FormGroup className="col-12 col-lg-6">
                                                <FormLabel>
                                                    Gần địa điểm nào
                                                </FormLabel>
                                                <input
                                                    label="Gần địa điểm nào"
                                                    variant="outlined"
                                                    name="strpublicLocationNearbyeet"
                                                    className="form-control"
                                                    onBlur={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            publicLocationNearby:
                                                                value.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </FormGroup>
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={
                                        <ExpandMoreIcon fontSize={'large'} />
                                    }
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <h2>Tìm kiếm chi tiết</h2>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ width: '100%' }}>
                                        <div className="row">
                                            <FormGroup className="col-12 col-md-6 col-lg-4">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4">
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
                                            <FormGroup className="col-12 col-md-6 col-lg-4">
                                                <FormLabel>Bếp riêng</FormLabel>
                                                <Select
                                                    defaultValue={
                                                        kitchenTypeData[0]
                                                    }
                                                    options={kitchenTypeData}
                                                    name="kitchenTypeId"
                                                    isSearchable={false}
                                                    onChange={(value) =>
                                                        setFilterValues({
                                                            ...filterValues,
                                                            kitchenTypeId:
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
                                disabled={isLoading}
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
