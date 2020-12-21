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
import addressApi from '../../../../api/addressApi';
import roomApi from '../../../../api/roomApi';
import { DebounceInput } from 'react-debounce-input';
import MySelect from '../../../../share/components/select';

BasicInfo.propTypes = {
    handleBasicInfoChange: PropTypes.func,
};

function BasicInfo(props) {
    const {
        errors,
        touched,
        defaultValue,
        values,
        handleChange,
        setFieldTouched,
        setFieldValue,
    } = props;

    const [waterElectricity, setWaterElectricity] = React.useState('rent');
    const [roomTypeData, setRoomTypeData] = React.useState([]);
    const [provinceData, setProvinceData] = React.useState([]);
    const [districtData, setDistrictData] = React.useState([]);
    const [wardData, setWardData] = React.useState([]);
    const [roomAreaRangeData, setRoomAreaRangeData] = React.useState([]);
    const [kitchenTypeData, setKitchenTypeData] = React.useState([]);
    const [roomPaymentTypeData, setRoomPaymentTypeData] = React.useState([]);
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

    React.useEffect(() => {
        async function handleProvinceChange() {
            if (!values.province) return;
            values.district = null;
            values.ward = null;
            try {
                const response = await addressApi.getDistrictByProvinceId(
                    values.province.value
                );
                setDistrictData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        handleProvinceChange();
    }, [values.province]);

    React.useEffect(() => {
        async function handleDistrictChange() {
            if (!values.district) return;
            values.ward = null;
            try {
                const response = await addressApi.getWardByDistrictID(
                    values.district.value
                );
                setWardData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                console.log(error);
            }
        }
        handleDistrictChange();
    }, [values.district]);

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
                        onChange={handleChange}
                        value={values.title}
                    />
                    {errors.title && touched.title && (
                        <span>{errors.title}</span>
                    )}
                </FormGroup>
                <div className="row">
                    <FormGroup className="col-3">
                        <FormLabel>Số lượng phòng</FormLabel>
                        <DebounceInput
                            type="number"
                            name="roomQuantity"
                            className="form-control"
                            onChange={handleChange}
                            value={values.roomQuantity}
                        />
                        {errors.roomQuantity && touched.roomQuantity && (
                            <span>{errors.roomQuantity}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-4">
                        <FormLabel>Loại Phòng</FormLabel>
                        <MySelect
                            name="roomType"
                            options={roomTypeData}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.roomType}
                        />
                        {errors.roomType && touched.roomType && (
                            <span>{errors.roomType}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-5">
                        <FormLabel>Số nhà, Đường</FormLabel>
                        <DebounceInput
                            type="text"
                            name="street"
                            className="form-control"
                            onChange={handleChange}
                            value={values.street}
                        />
                        {errors.street && touched.street && (
                            <span>{errors.street}</span>
                        )}
                    </FormGroup>
                </div>
                <FormGroup>
                    <FormLabel>Gần địa điểm công cộng</FormLabel>
                    <DebounceInput
                        type="text"
                        className="form-control"
                        name="publicLocationNearby"
                        onChange={handleChange}
                        value={values.publicLocationNearby}
                    />
                    {errors.publicLocationNearby &&
                        touched.publicLocationNearby && (
                            <span>{errors.publicLocationNearby}</span>
                        )}
                </FormGroup>

                <div className="row">
                    <FormGroup className="col-4">
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <MySelect
                            options={provinceData}
                            name="province"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.province}
                        />
                        {errors.province && touched.province && (
                            <span>{errors.province}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-4">
                        <FormLabel>Quận/Huyện</FormLabel>
                        <MySelect
                            options={districtData}
                            name="district"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.district}
                        />
                        {errors.district && touched.district && (
                            <span>{errors.district}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-4">
                        <FormLabel>Xã/Phường</FormLabel>
                        <MySelect
                            options={wardData}
                            name="ward"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.ward}
                        />
                        {errors.ward && touched.ward && (
                            <span>{errors.ward}</span>
                        )}
                    </FormGroup>
                </div>
                <div className="row">
                    <FormGroup className="col-8">
                        <FormLabel>Giá tiền(vnd)</FormLabel>
                        <DebounceInput
                            type={'number'}
                            className="form-control"
                            name="roomPrice"
                            onChange={handleChange}
                            value={values.roomPrice}
                        />
                        {errors.roomPrice && touched.roomPrice && (
                            <span>{errors.roomPrice}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-4">
                        <FormLabel>Tháng/Quý/Năm</FormLabel>
                        <MySelect
                            name="roomPaymentType"
                            options={roomPaymentTypeData}
                            values={values.roomPaymentType}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                        />
                        {errors.roomPaymentType && touched.roomPaymentType && (
                            <span>{errors.roomPaymentType}</span>
                        )}
                    </FormGroup>
                </div>
                <div className="row">
                    <FormGroup className="col-6">
                        <FormLabel>Diện tích</FormLabel>
                        <MySelect
                            name="roomArea"
                            options={roomAreaRangeData}
                            values={values.roomArea}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                        />
                        {errors.roomArea && touched.roomArea && (
                            <span>{errors.roomArea}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-6">
                        <FormLabel>Bếp(Nấu ăn)</FormLabel>
                        <MySelect
                            name="kitchenType"
                            options={kitchenTypeData}
                            values={values.kitchenType}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                        />
                        {errors.kitchenType && touched.kitchenType && (
                            <span>{errors.kitchenType}</span>
                        )}
                    </FormGroup>
                </div>
                <FormGroup>
                    <FormLabel>Điện nước</FormLabel>
                    <RadioGroup
                        aria-label="gender"
                        name="waterElectricity"
                        value={values.waterElectricity}
                        onChange={handleChange}
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
                        display:
                            values.waterElectricity === 'normal' ? 'none' : '',
                    }}
                >
                    <div className="row">
                        <FormGroup className="col-6">
                            <FormLabel>Giá điện</FormLabel>
                            <DebounceInput
                                type="number"
                                name="electricityPrice"
                                className="form-control"
                                defaultValue={0}
                                onChange={handleChange}
                                values={values.electricityPrice}
                            />
                            {errors.electricityPrice &&
                                touched.electricityPrice && (
                                    <span>{errors.electricityPrice}</span>
                                )}
                        </FormGroup>
                        <FormGroup className="col-6">
                            <FormLabel>Giá nước</FormLabel>
                            <DebounceInput
                                type="number"
                                name="waterPrice"
                                className="form-control"
                                defaultValue={0}
                                onChange={handleChange}
                                values={values.waterPrice}
                            />
                            {errors.waterPrice && touched.waterPrice && (
                                <span>{errors.waterPrice}</span>
                            )}
                        </FormGroup>
                    </div>
                </div>
                <FormGroup>
                    <FormLabel>Chung chủ (Có/Không)</FormLabel>
                    <Checkbox
                        name="liveWithOwner"
                        onChange={handleChange}
                        values={values.liveWithOwner}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Phòng tắm khép kín (Có/Không)</FormLabel>
                    <Checkbox
                        name="closeBathroom"
                        onChange={handleChange}
                        values={values.closeBathroom}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Nóng lạnh (Có/Không)</FormLabel>
                    <Checkbox
                        name="haveWaterHeader"
                        onChange={handleChange}
                        values={values.haveWaterHeader}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Điều hòa (Có/Không)</FormLabel>
                    <Checkbox
                        name="haveAirCondition"
                        onChange={handleChange}
                        values={values.haveAirCondition}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Ban Công(Có/Không)</FormLabel>
                    <Checkbox
                        name="haveBalcony"
                        onChange={handleChange}
                        values={values.haveBalcony}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Tiện ích khác</FormLabel>
                    <DebounceInput
                        type="text"
                        className="form-control"
                        name="roomOption"
                        onChange={handleChange}
                        values={values.roomOption}
                    />
                    {errors.roomOption && touched.roomOption && (
                        <span>{errors.roomOption}</span>
                    )}
                </FormGroup>
            </div>
        </div>
    );
}

export default BasicInfo;
