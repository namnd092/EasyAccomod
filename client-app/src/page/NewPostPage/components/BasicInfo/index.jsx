import React from 'react';
import PropTypes from 'prop-types';
import addressApi from '../../../../api/addressApi';
import roomApi from '../../../../api/roomApi';
import DebouncedInput from '../../../../components/DebouncedInput';
import MySelect from '../../../../share/components/select';
import { FormGroup, FormLabel, Checkbox, Radio, inputClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../../ui';

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
            if (values.province?.value == null) return;
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
            if (values.district?.value == null) return;
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
        <div className={`${cardClass} mt-6`}>
            <h5 className={cardHeaderClass}>Thông tin cơ bản</h5>
            <div className={cardBodyClass}>
                <FormGroup>
                    <FormLabel>Tiêu đề</FormLabel>
                    <DebouncedInput
                        type="text"
                        name="title"
                        className={inputClass}
                        onChange={handleChange}
                        value={
                            defaultValue
                                ? (values.title = defaultValue.title)
                                : values.title
                        }
                    />
                    {errors.title && touched.title && (
                        <span className="mt-1 text-sm text-red-600">{errors.title}</span>
                    )}
                </FormGroup>
                <div className="grid grid-cols-12 gap-x-4">
                    <FormGroup className="col-span-3">
                        <FormLabel>Số lượng phòng</FormLabel>
                        <DebouncedInput
                            type="number"
                            name="roomQuantity"
                            className={inputClass}
                            onChange={handleChange}
                            value={
                                defaultValue
                                    ? (values.roomQuantity =
                                          defaultValue.accommodation.roomQuantity)
                                    : values.roomQuantity
                            }
                        />
                        {errors.roomQuantity && touched.roomQuantity && (
                            <span className="mt-1 text-sm text-red-600">{errors.roomQuantity}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-span-4">
                        <FormLabel>Loại Phòng</FormLabel>
                        <MySelect
                            name="roomType"
                            options={roomTypeData}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.roomType}
                            defaultValue={roomTypeData[0]}
                        />
                        {errors.roomType && touched.roomType && (
                            <span className="mt-1 text-sm text-red-600">{errors.roomType}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-span-5">
                        <FormLabel>Số nhà, Đường</FormLabel>
                        <DebouncedInput
                            type="text"
                            name="street"
                            className={inputClass}
                            onChange={handleChange}
                            value={
                                defaultValue
                                    ? (values.street =
                                          defaultValue.accommodation.address.street)
                                    : values.street
                            }
                        />
                        {errors.street && touched.street && (
                            <span className="mt-1 text-sm text-red-600">{errors.street}</span>
                        )}
                    </FormGroup>
                </div>
                <FormGroup>
                    <FormLabel>Gần địa điểm công cộng</FormLabel>
                    <DebouncedInput
                        type="text"
                        className={inputClass}
                        name="publicLocationNearby"
                        onChange={handleChange}
                        value={
                            defaultValue
                                ? (values.publicLocationNearby =
                                      defaultValue.accommodation.address.publicLocationNearby)
                                : values.publicLocationNearby
                        }
                    />
                    {errors.publicLocationNearby &&
                        touched.publicLocationNearby && (
                            <span className="mt-1 text-sm text-red-600">
                                {errors.publicLocationNearby}
                            </span>
                        )}
                </FormGroup>

                <div className="grid grid-cols-12 gap-x-4">
                    <FormGroup className="col-span-4">
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <MySelect
                            options={provinceData}
                            name="province"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.province}
                        />
                        {errors.province && touched.province && (
                            <span className="mt-1 text-sm text-red-600">{errors.province}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-span-4">
                        <FormLabel>Quận/Huyện</FormLabel>
                        <MySelect
                            options={districtData}
                            name="district"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.district}
                        />
                        {errors.district && touched.district && (
                            <span className="mt-1 text-sm text-red-600">{errors.district}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-span-4">
                        <FormLabel>Xã/Phường</FormLabel>
                        <MySelect
                            options={wardData}
                            name="ward"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            values={values.ward}
                        />
                        {errors.ward && touched.ward && (
                            <span className="mt-1 text-sm text-red-600">{errors.ward}</span>
                        )}
                    </FormGroup>
                </div>
                <div className="grid grid-cols-12 gap-x-4">
                    <FormGroup className="col-span-8">
                        <FormLabel>Giá tiền(vnd)</FormLabel>
                        <DebouncedInput
                            type={'number'}
                            className={inputClass}
                            name="roomPrice"
                            onChange={handleChange}
                            value={
                                defaultValue
                                    ? defaultValue.accommodation.price
                                    : values.roomPrice
                            }
                        />
                        {errors.roomPrice && touched.roomPrice && (
                            <span className="mt-1 text-sm text-red-600">{errors.roomPrice}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-span-4">
                        <FormLabel>Tháng/Quý/Năm</FormLabel>
                        <MySelect
                            name="roomPaymentType"
                            options={roomPaymentTypeData}
                            values={values.roomPaymentType}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                        />
                        {errors.roomPaymentType && touched.roomPaymentType && (
                            <span className="mt-1 text-sm text-red-600">
                                {errors.roomPaymentType}
                            </span>
                        )}
                    </FormGroup>
                </div>
                <div className="grid grid-cols-12 gap-x-4">
                    <FormGroup className="col-span-6">
                        <FormLabel>Diện tích</FormLabel>
                        <MySelect
                            name="roomArea"
                            options={roomAreaRangeData}
                            values={values.roomArea}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                        />
                        {errors.roomArea && touched.roomArea && (
                            <span className="mt-1 text-sm text-red-600">{errors.roomArea}</span>
                        )}
                    </FormGroup>
                    <FormGroup className="col-span-6">
                        <FormLabel>Bếp(Nấu ăn)</FormLabel>
                        <MySelect
                            name="kitchenType"
                            options={kitchenTypeData}
                            values={values.kitchenType}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                        />
                        {errors.kitchenType && touched.kitchenType && (
                            <span className="mt-1 text-sm text-red-600">{errors.kitchenType}</span>
                        )}
                    </FormGroup>
                </div>
                <FormGroup>
                    <FormLabel>Điện nước</FormLabel>
                    <div className="grid grid-cols-12 gap-x-4">
                        <label className="col-span-6 flex cursor-pointer items-center gap-2">
                            <Radio
                                name="waterElectricity"
                                value="rent"
                                checked={values.waterElectricity === 'rent'}
                                onChange={handleChange}
                            />
                            Giá thuê
                        </label>
                        <label className="col-span-5 flex cursor-pointer items-center gap-2">
                            <Radio
                                name="waterElectricity"
                                value="normal"
                                checked={values.waterElectricity === 'normal'}
                                onChange={handleChange}
                            />
                            Giá dân
                        </label>
                    </div>
                </FormGroup>

                <div
                    style={{
                        display:
                            values.waterElectricity === 'normal' ? 'none' : '',
                    }}
                >
                    <div className="grid grid-cols-12 gap-x-4">
                        <FormGroup className="col-span-6">
                            <FormLabel>Giá điện</FormLabel>
                            <DebouncedInput
                                type="number"
                                name="electricityPrice"
                                className={inputClass}
                                defaultValue={0}
                                onChange={handleChange}
                            />
                            {errors.electricityPrice &&
                                touched.electricityPrice && (
                                    <span className="mt-1 text-sm text-red-600">
                                        {errors.electricityPrice}
                                    </span>
                                )}
                        </FormGroup>
                        <FormGroup className="col-span-6">
                            <FormLabel>Giá nước</FormLabel>
                            <DebouncedInput
                                type="number"
                                name="waterPrice"
                                className={inputClass}
                                defaultValue={0}
                                onChange={handleChange}
                            />
                            {errors.waterPrice && touched.waterPrice && (
                                <span className="mt-1 text-sm text-red-600">
                                    {errors.waterPrice}
                                </span>
                            )}
                        </FormGroup>
                    </div>
                </div>
                <FormGroup>
                    <FormLabel>Chung chủ (Có/Không)</FormLabel>
                    <Checkbox
                        name="liveWithOwner"
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Phòng tắm khép kín (Có/Không)</FormLabel>
                    <Checkbox
                        name="closeBathroom"
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Nóng lạnh (Có/Không)</FormLabel>
                    <Checkbox
                        name="haveWaterHeader"
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Điều hòa (Có/Không)</FormLabel>
                    <Checkbox
                        name="haveAirCondition"
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Ban Công(Có/Không)</FormLabel>
                    <Checkbox
                        name="haveBalcony"
                        onChange={handleChange}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Tiện ích khác</FormLabel>
                    <DebouncedInput
                        type="text"
                        className={inputClass}
                        name="roomOption"
                        onChange={handleChange}
                        value={
                            defaultValue
                                ? defaultValue.accommodation.roomOption
                                : values.roomOption
                        }
                    />
                    {errors.roomOption && touched.roomOption && (
                        <span className="mt-1 text-sm text-red-600">{errors.roomOption}</span>
                    )}
                </FormGroup>
            </div>
        </div>
    );
}

export default BasicInfo;
