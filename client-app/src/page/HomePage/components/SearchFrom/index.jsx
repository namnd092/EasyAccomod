import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { useState } from 'react';
import addressApi from '../../../../api/addressApi';
import roomApi from '../../../../api/roomApi';
import { Button, Collapsible, FormGroup, FormLabel, inputClass } from '../../../../ui';

SearchFrom.propTypes = {
    onSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
};

// On phones the filters would push the results far down, so start collapsed there.
const isDesktop = typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 1024px)').matches;

function SearchFrom(props) {
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

    // The two text inputs are registered with react-hook-form; the selects keep living in filterValues.
    const { register, handleSubmit } = useForm({
        defaultValues: { street: '', publicLocationNearby: '' },
    });
    const submitFilters = (textValues) => {
        props.onSubmit({ ...filterValues, ...textValues });
    };

    return (
        <form onSubmit={handleSubmit(submitFilters)}>
            <div className="flex flex-col gap-3">
                    <Collapsible title="Tìm kiếm cơ bản" defaultOpen={isDesktop}>
                            <div style={{ width: '100%' }}>
                                <div className="grid grid-cols-12 gap-x-4">
                                    <FormGroup className="col-span-12 md:col-span-6 xl:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 xl:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 xl:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 xl:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 xl:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 xl:col-span-4">
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

                                <div className="grid grid-cols-12 gap-x-4">
                                    <FormGroup className="col-span-12 lg:col-span-6">
                                        <FormLabel>
                                            Đường/Số nhà
                                        </FormLabel>
                                        <input className={inputClass} {...register('street')} />
                                    </FormGroup>
                                    <FormGroup className="col-span-12 lg:col-span-6">
                                        <FormLabel>
                                            Gần địa điểm nào
                                        </FormLabel>
                                        <input className={inputClass} {...register('publicLocationNearby')} />
                                    </FormGroup>
                                </div>
                            </div>
                        </Collapsible>
                    <Collapsible title="Tìm kiếm chi tiết">
                            <div style={{ width: '100%' }}>
                                <div className="grid grid-cols-12 gap-x-4">
                                    <FormGroup className="col-span-12 md:col-span-6 lg:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 lg:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 lg:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 lg:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 lg:col-span-4">
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
                                    <FormGroup className="col-span-12 md:col-span-6 lg:col-span-4">
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
                        </Collapsible>
                <div className="flex justify-end">
                    <Button
                        type={'submit'}
                        variant="secondary"
                        disabled={isLoading}
                        size="lg"
                    >
                        Tìm kiếm <i className="fas fa-search ml-1.5" aria-hidden="true"></i>
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default SearchFrom;
