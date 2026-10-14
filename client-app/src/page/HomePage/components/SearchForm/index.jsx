import React from 'react';
import Select from 'react-select';
import addressApi from '../../../../api/addressApi';
import roomApi from '../../../../api/roomApi';
import { Button, Collapsible, FormGroup, FormLabel, inputClass } from '../../../../ui';
import { notifyError } from '../../../../helper/notify';
import { PRICE_RANGES, filtersToParams, priceRangeValue } from '../../searchFilters';

// On phones the filters would push the results far down, so start collapsed there.
const isDesktop = typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 1024px)').matches;

const ALL_OPTION = { value: 0, label: 'Tất cả' };
const YES_NO_OPTIONS = [ALL_OPTION, { value: 1, label: 'Có' }, { value: -1, label: 'Không' }];
const YES_NO_FIELDS = [
    ['liveWithOwner', 'Chung chủ'],
    ['haveWaterHeater', 'Nóng lạnh'],
    ['haveBalcony', 'Ban công'],
    ['haveAirConditioner', 'Điều hòa'],
    ['haveClosedBathroom', 'Nhà tắm riêng'],
];
const DETAIL_FIELDS = [...YES_NO_FIELDS.map(([name]) => name), 'kitchenTypeId'];
const BASIC_FIELDS = [
    'provinceId',
    'districtId',
    'wardId',
    'accommodationTypeId',
    'paymentTypeId',
    'minPrice',
    'maxPrice',
    'roomAreaRangeId',
    'street',
    'publicLocationNearby',
];

const loadProvinces = () => addressApi.getAllProvince();
const loadDistricts = (provinceId) => addressApi.getDistrictByProvinceId(provinceId);
const loadWards = (districtId) => addressApi.getWardByDistrictID(districtId);
const loadRoomTypes = () => roomApi.getAllRoomType();
const loadRoomAreas = () => roomApi.getAllRoomAreaType();
const loadPaymentTypes = () => roomApi.getAllPaymentType();
const loadKitchenTypes = () => roomApi.getAllKitchenType();
const nameOption = ({ id, name }) => ({ value: id, label: name });
const rangeOption = ({ id, range }) => ({ value: id, label: range });

// Options fetched from the API, led by "Tất cả". With a parent id the options belong to that parent
// (the districts of a province) and are only fetched while one is chosen (0 means none).
function useOptions(load, toOption, parentId) {
    const [loaded, setLoaded] = React.useState({ parentId: undefined, options: [] });
    React.useEffect(() => {
        if (parentId === 0) return undefined;
        let ignore = false;
        load(parentId)
            .then((items) => {
                if (!ignore) setLoaded({ parentId, options: items.map(toOption) });
            })
            .catch((error) => {
                if (!ignore) notifyError(error);
            });
        return () => {
            ignore = true;
        };
    }, [load, toOption, parentId]);
    return parentId === 0 || loaded.parentId !== parentId ? [ALL_OPTION] : [ALL_OPTION, ...loaded.options];
}

function FilterSelect({ label, value, options, onChange, searchable = false, className = 'col-span-12 md:col-span-6 xl:col-span-4' }) {
    const id = React.useId();
    return (
        <FormGroup className={className}>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <Select
                inputId={id}
                options={options}
                value={options.find((option) => option.value === value) ?? null}
                isSearchable={searchable}
                placeholder="Chọn..."
                onChange={(option) => onChange(option.value)}
            />
        </FormGroup>
    );
}

function TextFilter({ label, value, onChange }) {
    const id = React.useId();
    return (
        <FormGroup className="col-span-12 md:col-span-6 xl:col-span-4">
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <input id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        </FormGroup>
    );
}

// `filters` are the filters of the current search (from the URL). The form edits its own draft of them
// and only applies it on submit; when the applied filters change from outside (back button, clear) the draft follows.
function SearchForm({ filters, activeCount, onSubmit, onClear, isLoading }) {
    const [draft, setDraft] = React.useState(filters);
    const appliedKey = filtersToParams(filters).toString();
    const [syncedKey, setSyncedKey] = React.useState(appliedKey);
    if (syncedKey !== appliedKey) {
        setSyncedKey(appliedKey);
        setDraft(filters);
    }
    const setField = (name) => (value) => setDraft((current) => ({ ...current, [name]: value }));

    const provinces = useOptions(loadProvinces, nameOption);
    const districts = useOptions(loadDistricts, nameOption, draft.provinceId);
    const wards = useOptions(loadWards, nameOption, draft.districtId);
    const roomTypes = useOptions(loadRoomTypes, nameOption);
    const roomAreas = useOptions(loadRoomAreas, rangeOption);
    const paymentTypes = useOptions(loadPaymentTypes, nameOption);
    const kitchenTypes = useOptions(loadKitchenTypes, nameOption);

    const changeProvince = (provinceId) => setDraft((current) => ({ ...current, provinceId, districtId: 0, wardId: 0 }));
    const changeDistrict = (districtId) => setDraft((current) => ({ ...current, districtId, wardId: 0 }));
    const changePrice = (value) => {
        const { minPrice, maxPrice } = PRICE_RANGES.find((range) => range.value === value);
        setDraft((current) => ({ ...current, minPrice, maxPrice }));
    };

    const submit = (event) => {
        event.preventDefault();
        onSubmit({
            ...draft,
            street: draft.street.trim(),
            publicLocationNearby: draft.publicLocationNearby.trim(),
        });
    };

    // Open what is already filtered, so the applied filters are never hidden.
    const hasApplied = (fields) => fields.some((name) => filtersToParams(filters).has(name));

    return (
        <form onSubmit={submit}>
            <div className="flex flex-col gap-3">
                <Collapsible title="Tìm kiếm cơ bản" defaultOpen={isDesktop || hasApplied(BASIC_FIELDS)}>
                    <div className="grid grid-cols-12 gap-x-4">
                        <FilterSelect label="Tỉnh/Thành phố" value={draft.provinceId} options={provinces} onChange={changeProvince} searchable />
                        <FilterSelect label="Quận/Huyện" value={draft.districtId} options={districts} onChange={changeDistrict} searchable />
                        <FilterSelect label="Xã/Phường" value={draft.wardId} options={wards} onChange={setField('wardId')} searchable />
                        <FilterSelect label="Loại phòng" value={draft.accommodationTypeId} options={roomTypes} onChange={setField('accommodationTypeId')} searchable />
                        <FilterSelect label="Mức giá" value={priceRangeValue(draft)} options={PRICE_RANGES} onChange={changePrice} />
                        <FilterSelect label="Hình thức thanh toán" value={draft.paymentTypeId} options={paymentTypes} onChange={setField('paymentTypeId')} />
                        <FilterSelect label="Diện tích" value={draft.roomAreaRangeId} options={roomAreas} onChange={setField('roomAreaRangeId')} />
                        <TextFilter label="Đường/Số nhà" value={draft.street} onChange={setField('street')} />
                        <TextFilter label="Gần địa điểm nào" value={draft.publicLocationNearby} onChange={setField('publicLocationNearby')} />
                    </div>
                </Collapsible>
                <Collapsible title="Tìm kiếm chi tiết" defaultOpen={hasApplied(DETAIL_FIELDS)}>
                    <div className="grid grid-cols-12 gap-x-4">
                        {YES_NO_FIELDS.map(([name, label]) => (
                            <FilterSelect
                                key={name}
                                label={label}
                                value={draft[name]}
                                options={YES_NO_OPTIONS}
                                onChange={setField(name)}
                                className="col-span-12 md:col-span-6 lg:col-span-4"
                            />
                        ))}
                        <FilterSelect
                            label="Bếp riêng"
                            value={draft.kitchenTypeId}
                            options={kitchenTypes}
                            onChange={setField('kitchenTypeId')}
                            className="col-span-12 md:col-span-6 lg:col-span-4"
                        />
                    </div>
                </Collapsible>
                {/* Stuck to the bottom of the screen on phones so the search button is always in reach. */}
                <div className="sticky bottom-0 z-10 -mx-5 flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-3 lg:static lg:mx-0 lg:border-0 lg:px-0 lg:py-0">
                    <div className="flex items-center gap-2 text-xs text-gray-600 sm:gap-3 sm:text-sm">
                        {activeCount > 0 && (
                            <>
                                <span className="whitespace-nowrap sm:hidden">{activeCount} bộ lọc</span>
                                <span className="hidden sm:inline">Đang áp dụng {activeCount} bộ lọc</span>
                                <Button variant="neutral" onClick={onClear} className="whitespace-nowrap">
                                    Xóa bộ lọc
                                </Button>
                            </>
                        )}
                    </div>
                    <Button type="submit" variant="secondary" disabled={isLoading} size="lg" className="whitespace-nowrap">
                        Tìm kiếm <i className="fas fa-search ml-1.5" aria-hidden="true"></i>
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default SearchForm;
