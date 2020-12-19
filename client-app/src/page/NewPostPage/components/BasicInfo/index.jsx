import React from 'react';
import PropTypes from 'prop-types';
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
} from '@material-ui/core';
import Select from 'react-select';
import addressApi from '../../../../api/addressApi';
import roomApi from '../../../../api/roomApi';
import { DebounceInput } from 'react-debounce-input';

BasicInfo.propTypes = {
    handleBasicInfoChange: PropTypes.func,
};

function BasicInfo(props) {
    const { handleBasicInfoChange, errors, touched, defaultValue } = props;

    const [waterElectricity, setWaterElectricity] = React.useState('rent');
    const [roomTypeData, setRoomTypeData] = React.useState([]);
    const [provinceData, setProvinceData] = React.useState([]);
    const [districtData, setDistrictData] = React.useState([]);
    const [wardData, setWardData] = React.useState([]);
    const [roomAreaRangeData, setRoomAreaRangeData] = React.useState([]);
    const [kitchenTypeData, setKitchenTypeData] = React.useState([]);
    const [roomPaymentTypeData, setRoomPaymentTypeData] = React.useState([]);
    const [formValues, setFormValues] = React.useState({
        title: null,
        roomType: null,
        province: null,
        district: null,
        ward: null,
        street: null,
        roomPrice: null,
        roomPaymentType: null,
        roomArea: null,
        roomQuantity: null,
        liveWithOwner: false,
        closeBathroom: false,
        haveWaterHeader: false,
        haveAirCondition: false,
        haveBalcony: false,
        kitchenType: 0,
        waterElectricity: 'rent',
        electricityPrice: null,
        waterPrice: null,
    });

    const handleTitleChange = (value) => {
        setFormValues({ ...formValues, title: value.target.value });
        handleBasicInfoChange(formValues);
    };
    const handleRoomTypeChange = (value) => {
        setFormValues({ ...formValues, roomType: value.value });
        handleBasicInfoChange(formValues);
    };
    const handleProvinceChange = async (value) => {
        const provinceId = value.value;
        setFormValues({
            ...formValues,
            province: provinceId,
            district: null,
            ward: null,
        });
        handleBasicInfoChange(formValues);
        try {
            const response = await addressApi.getDistrictByProvinceId(
                provinceId
            );
            setDistrictData(
                [...response].map((e) => ({ value: e.id, label: e.name }))
            );
        } catch (error) {
            console.log(error);
        }
    };
    const handleDistrictChange = async (value) => {
        const districtId = value.value;
        setFormValues({ ...formValues, district: districtId, ward: null });
        handleBasicInfoChange(formValues);
        try {
            const response = await addressApi.getWardByDistrictID(districtId);
            setWardData(
                [...response].map((e) => ({ value: e.id, label: e.name }))
            );
        } catch (error) {
            console.log(error);
        }
    };
    const handleWardChange = (value) => {
        const ward = value.value;
        setFormValues({ ...formValues, ward });
        handleBasicInfoChange(formValues);
    };
    const handleStreetChange = (value) => {
        const street = value.target.value;
        setFormValues({ ...formValues, street });
        handleBasicInfoChange(formValues);
    };
    const handleRoomPriceChange = (value) => {
        const roomPrice = value.target.value;
        setFormValues({ ...formValues, roomPrice });
        handleBasicInfoChange(formValues);
    };
    const handleRoomPaymentTypeChange = (value) => {
        const roomPaymentType = value.value;
        setFormValues({ ...formValues, roomPaymentType });
        handleBasicInfoChange(formValues);
    };
    const handleRoomAreaChange = (value) => {
        const roomArea = value.value;
        setFormValues({ ...formValues, roomArea });
        handleBasicInfoChange(formValues);
    };
    const handleRoomQuantityChange = (value) => {
        const roomQuantity = value.target.value;
        setFormValues({ ...formValues, roomQuantity });
        handleBasicInfoChange(formValues);
    };
    const handleLiveWithOwnerChange = (value) => {
        const liveWithOwner = value.target.checked;
        setFormValues({ ...formValues, liveWithOwner });
        handleBasicInfoChange(formValues);
    };
    const handleCloseBathroomChange = (value) => {
        const closeBathroom = value.target.checked;
        setFormValues({ ...formValues, closeBathroom });
        handleBasicInfoChange(formValues);
    };
    const handleHaveWaterHeaderChange = (value) => {
        const haveWaterHeader = value.target.checked;
        setFormValues({ ...formValues, haveWaterHeader });
        handleBasicInfoChange(formValues);
    };
    const handleHaveAirConditionChange = (value) => {
        const haveAirCondition = value.target.checked;
        setFormValues({ ...formValues, haveAirCondition });
        handleBasicInfoChange(formValues);
    };
    const handleHaveBalconyChange = (value) => {
        const haveBalcony = value.target.checked;
        setFormValues({ ...formValues, haveBalcony });
        handleBasicInfoChange(formValues);
    };
    const handleKitchenTypeChange = (value) => {
        const kitchenType = value.value;
        setFormValues({ ...formValues, kitchenType });
        handleBasicInfoChange(formValues);
    };
    const handleWaterElectricityChange = (value) => {
        const waterElectricity = value.target.value;
        if (waterElectricity === 'rent') {
            setFormValues({ ...formValues, waterElectricity });
        } else {
            setFormValues({
                ...formValues,
                waterElectricity,
                electricityPrice: null,
                waterPrice: null,
            });
        }
        setWaterElectricity(waterElectricity);
        handleBasicInfoChange(formValues);
    };
    const handleElectricityPriceChange = (value) => {
        const electricityPrice = value.target.value;
        setFormValues({ ...formValues, electricityPrice });
        handleBasicInfoChange(formValues);
    };
    const handleWaterPriceChange = (value) => {
        const waterPrice = value.target.value;
        setFormValues({ ...formValues, waterPrice });
        handleBasicInfoChange(formValues);
    };

    React.useEffect(() => {
        async function effectGetAllProvince() {
            try {
                const response = await addressApi.getAllProvince();
                setProvinceData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetAllProvince();

        async function effectGetRoomType() {
            try {
                const response = await roomApi.getAllRoomType();
                setRoomTypeData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetRoomType();

        async function effectGetKitchenType() {
            try {
                const response = await roomApi.getAllKitchenType();
                setKitchenTypeData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetKitchenType();

        async function effectGetRoomAreaRange() {
            try {
                const response = await roomApi.getAllRoomAreaType();
                setRoomAreaRangeData(
                    [...response].map((e) => ({ value: e.id, label: e.range }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetRoomAreaRange();

        async function effectGetRoomPaymentType() {
            try {
                const response = await roomApi.getAllPaymentType();
                setRoomPaymentTypeData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        effectGetRoomPaymentType();
    }, []);

    return (
        <div class="card mt-4">
            <h5 class="card-header">Thông tin cơ bản</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel>Tiêu đề</FormLabel>
                    <DebounceInput
                        type="text"
                        name="title"
                        className="form-control"
                        onChange={handleTitleChange}
                    />
                    {errors && touched && <span>{errors.title}</span>}
                </FormGroup>
                <div className="row">
                    <FormGroup className="col-3">
                        <FormLabel>Số lượng phòng</FormLabel>
                        <DebounceInput
                            type="number"
                            name="roomQuantity"
                            className="form-control"
                            onChange={handleRoomQuantityChange}
                        />
                    </FormGroup>
                    <FormGroup className="col-4">
                        <FormLabel>Loại Phòng</FormLabel>
                        <Select
                            name="roomType"
                            defaultValue={roomTypeData[0]}
                            options={roomTypeData}
                            onChange={handleRoomTypeChange}
                        />
                        {errors && touched && <span>{errors.title}</span>}
                    </FormGroup>
                    <FormGroup className="col-5">
                        <FormLabel>Số nhà, Đường</FormLabel>
                        <DebounceInput
                            type="text"
                            name="street"
                            className="form-control"
                            onChange={handleStreetChange}
                        />
                        {errors && touched && <span>{errors.title}</span>}
                    </FormGroup>
                </div>
                <FormGroup>
                    <FormLabel>Gần địa điểm công cộng</FormLabel>
                    <DebounceInput
                        type="text"
                        className="form-control"
                        name="publicLocationNearby"
                    />
                </FormGroup>
                <div className="row">
                    <FormGroup className="col-4">
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <Select
                            name="province"
                            defaultValue={provinceData[0]}
                            options={provinceData}
                            value={
                                formValues.province
                                    ? provinceData.find(
                                          (e) => e.value === formValues.province
                                      )
                                    : null
                            }
                            onChange={handleProvinceChange}
                        />
                        {errors && touched && <span>{errors.title}</span>}
                    </FormGroup>
                    <FormGroup className="col-4">
                        <FormLabel>Quận/Huyện</FormLabel>
                        <Select
                            name="district"
                            defaultValue={districtData[0]}
                            options={districtData}
                            value={
                                formValues.district
                                    ? districtData.find(
                                          (e) => e.value === formValues.district
                                      )
                                    : null
                            }
                            onChange={handleDistrictChange}
                        />
                        {errors && touched && <span>{errors.title}</span>}
                    </FormGroup>
                    <FormGroup className="col-4">
                        <FormLabel>Xã/Phường</FormLabel>
                        <Select
                            name="ward"
                            defaultValue={wardData[0]}
                            options={wardData}
                            value={
                                formValues.ward
                                    ? wardData.find(
                                          (e) => e.value === formValues.ward
                                      )
                                    : null
                            }
                            onChange={handleWardChange}
                        />
                        {errors && touched && <span>{errors.title}</span>}
                    </FormGroup>
                </div>
                <FormGroup>
                    <FormLabel>Giá tiền(vnd)</FormLabel>
                    <div style={{ display: 'flex' }}>
                        <DebounceInput
                            type={'number'}
                            className="form-control col-8"
                            name="roomPrice"
                            onChange={handleRoomPriceChange}
                        />
                        <Select
                            name="roomPaymentType"
                            defaultValue={roomPaymentTypeData[0]}
                            options={roomPaymentTypeData}
                            className="col-4"
                            onChange={handleRoomPaymentTypeChange}
                        />
                    </div>
                    {errors && touched && <span>{errors.title}</span>}
                </FormGroup>
                <div className="row">
                    <FormGroup className="col-6">
                        <FormLabel>Diện tích</FormLabel>
                        <Select
                            name="roomArea"
                            defaultValue={roomAreaRangeData[0]}
                            options={roomAreaRangeData}
                            onChange={handleRoomAreaChange}
                        />
                    </FormGroup>
                    <FormGroup className="col-6">
                        <FormLabel>Bếp(Nấu ăn)</FormLabel>
                        <Select
                            name="kitchenType"
                            defaultValue={kitchenTypeData[0]}
                            options={kitchenTypeData}
                            onChange={handleKitchenTypeChange}
                        />
                    </FormGroup>
                </div>
                <FormGroup>
                    <FormLabel>Điện nước</FormLabel>
                    <RadioGroup
                        aria-label="gender"
                        name="waterElectricity"
                        value={waterElectricity}
                        onChange={handleWaterElectricityChange}
                    >
                        <div className="row">
                            <FormControlLabel
                                value="rent"
                                control={<Radio />}
                                label="Giá thuê"
                                className="col-6"
                            />
                            <FormControlLabel
                                value="normal"
                                control={<Radio />}
                                className="col-5"
                                label="Giá dân"
                            />
                        </div>
                    </RadioGroup>
                </FormGroup>
                <div
                    style={{
                        display: waterElectricity === 'normal' ? 'none' : '',
                    }}
                >
                    <div className="row">
                        <FormGroup className="col-6">
                            <FormLabel>Giá điện</FormLabel>
                            <DebounceInput
                                type="number"
                                name="electricityPrice"
                                className="form-control"
                                onChange={handleElectricityPriceChange}
                            />
                        </FormGroup>
                        <FormGroup className="col-6">
                            <FormLabel>Giá nước</FormLabel>
                            <DebounceInput
                                type="number"
                                name="waterPrice"
                                className="form-control"
                                onChange={handleWaterPriceChange}
                            />
                        </FormGroup>
                    </div>
                </div>
                <FormGroup>
                    <FormLabel>Chung chủ (Có/Không)</FormLabel>
                    <Checkbox
                        name="liveWithOwner"
                        onChange={handleLiveWithOwnerChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Phòng tắm khép kín (Có/Không)</FormLabel>
                    <Checkbox
                        name="closeBathroom"
                        onChange={handleCloseBathroomChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Nóng lạnh (Có/Không)</FormLabel>
                    <Checkbox
                        name="haveWaterHeader"
                        onChange={handleHaveWaterHeaderChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Điều hòa (Có/Không)</FormLabel>
                    <Checkbox
                        name="haveAirCondition"
                        onChange={handleHaveAirConditionChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Ban Công(Có/Không)</FormLabel>
                    <Checkbox
                        name="haveBalcony"
                        onChange={handleHaveBalconyChange}
                    />
                </FormGroup>
            </div>
        </div>
    );
}

export default BasicInfo;
