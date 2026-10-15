import React from 'react';
import addressApi from '../../../../api/addressApi';
import roomApi from '../../../../api/roomApi';
import { useFormContext, useWatch } from 'react-hook-form';
import { InputField, SelectField, CheckboxField } from '../../../../share/components/form-fields';
import { FormGroup, FormLabel, Radio, cardClass, cardHeaderClass, cardBodyClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';

function BasicInfo() {
    const { register, setValue } = useFormContext();
    const province = useWatch({ name: 'province' });
    const district = useWatch({ name: 'district' });
    const waterElectricity = useWatch({ name: 'waterElectricity' });
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
                notifyError(error);
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
                notifyError(error);
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
                notifyError(error);
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
                notifyError(error);
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
                notifyError(error);
            }
        }
        effectGetRoomPaymentType();
    }, []);

    React.useEffect(() => {
        async function handleProvinceChange() {
            if (province?.value == null) return;
            try {
                const response = await addressApi.getDistrictByProvinceId(
                    province.value
                );
                setDistrictData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                notifyError(error);
            }
        }
        handleProvinceChange();
    }, [province?.value]);

    React.useEffect(() => {
        async function handleDistrictChange() {
            if (district?.value == null) return;
            try {
                const response = await addressApi.getWardByDistrictID(
                    district.value
                );
                setWardData(
                    [...response].map((e) => ({ value: e.id, label: e.name }))
                );
            } catch (error) {
                notifyError(error);
            }
        }
        handleDistrictChange();
    }, [district?.value]);

    // Picking another province/district invalidates what was chosen below it.
    const handleProvinceChange = () => {
        setValue('district', null);
        setValue('ward', null);
    };
    const handleDistrictChange = () => setValue('ward', null);

    return (
        <div className={`${cardClass} mt-6`}>
            <h5 className={cardHeaderClass}>Thông tin cơ bản</h5>
            <div className={cardBodyClass}>
                <InputField label="Tiêu đề" name="title" />
                <div className="grid grid-cols-12 gap-x-4">
                    <InputField label="Số lượng phòng" name="roomQuantity" type="number" className="col-span-3" />
                    <SelectField label="Loại Phòng" name="roomType" options={roomTypeData} className="col-span-4" />
                    <InputField label="Số nhà, Đường" name="street" className="col-span-5" />
                </div>
                <InputField label="Gần địa điểm công cộng" name="publicLocationNearby" />
                <div className="grid grid-cols-12 gap-x-4">
                    <SelectField
                        label="Tỉnh/Thành phố"
                        name="province"
                        options={provinceData}
                        className="col-span-12 sm:col-span-4"
                        onChange={handleProvinceChange}
                    />
                    <SelectField
                        label="Quận/Huyện"
                        name="district"
                        options={districtData}
                        className="col-span-12 sm:col-span-4"
                        onChange={handleDistrictChange}
                    />
                    <SelectField label="Xã/Phường" name="ward" options={wardData} className="col-span-12 sm:col-span-4" />
                </div>
                <div className="grid grid-cols-12 gap-x-4">
                    <InputField label="Giá tiền(vnd)" name="roomPrice" type="number" className="col-span-12 sm:col-span-8" />
                    <SelectField
                        label="Tháng/Quý/Năm"
                        name="roomPaymentType"
                        options={roomPaymentTypeData}
                        className="col-span-12 sm:col-span-4"
                    />
                </div>
                <div className="grid grid-cols-12 gap-x-4">
                    <SelectField label="Diện tích" name="roomArea" options={roomAreaRangeData} className="col-span-6" />
                    <SelectField label="Bếp(Nấu ăn)" name="kitchenType" options={kitchenTypeData} className="col-span-6" />
                </div>
                <FormGroup>
                    <FormLabel>Điện nước</FormLabel>
                    <div className="grid grid-cols-12 gap-x-4">
                        <label className="col-span-6 flex cursor-pointer items-center gap-2">
                            <Radio value="rent" {...register('waterElectricity')} />
                            Giá thuê
                        </label>
                        <label className="col-span-5 flex cursor-pointer items-center gap-2">
                            <Radio value="normal" {...register('waterElectricity')} />
                            Giá dân
                        </label>
                    </div>
                </FormGroup>

                <div style={{ display: waterElectricity === 'normal' ? 'none' : '' }}>
                    <div className="grid grid-cols-12 gap-x-4">
                        <InputField label="Giá điện" name="electricityPrice" type="number" className="col-span-6" />
                        <InputField label="Giá nước" name="waterPrice" type="number" className="col-span-6" />
                    </div>
                </div>
                <CheckboxField label="Chung chủ (Có/Không)" name="liveWithOwner" />
                <CheckboxField label="Phòng tắm khép kín (Có/Không)" name="closeBathroom" />
                <CheckboxField label="Nóng lạnh (Có/Không)" name="haveWaterHeader" />
                <CheckboxField label="Điều hòa (Có/Không)" name="haveAirCondition" />
                <CheckboxField label="Ban Công(Có/Không)" name="haveBalcony" />
                <InputField label="Tiện ích khác" name="roomOption" />
            </div>
        </div>
    );
}

export default BasicInfo;
