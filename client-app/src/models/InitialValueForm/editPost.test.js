import { describe, expect, it } from 'vitest';
import postToFormValues from './editPost';

const post = {
    title: 'Phòng 1',
    content: 'Phòng đẹp',
    accommodation: {
        address: {
            provinceId: 1,
            province: { id: 1, name: 'Hà Nội' },
            districtId: 2,
            district: { id: 2, name: 'Ba Đình' },
            wardId: 3,
            ward: { id: 3, name: 'Phúc Xá' },
            street: '12 Ngõ Hoa',
            publicLocationNearby: 'Hồ Gươm',
        },
        accommodationTypeId: 1,
        accommodationType: { id: 1, name: 'Phòng trọ' },
        paymentTypeId: 4,
        paymentType: { id: 4, name: 'Tháng' },
        roomAreaRangeId: 2,
        roomAreaRange: { id: 2, range: '20-30m2' },
        kitchenTypeId: 5,
        kitchenType: { id: 5, name: 'Bếp riêng' },
        roomQuantity: 2,
        price: 3000000,
        liveWithOwner: false,
        haveClosedBathroom: true,
        haveWaterHeater: true,
        haveAirConditioner: false,
        haveBalcony: true,
        isStateElectricityPrice: true,
        electricityPrice: 3500,
        waterPrice: 20000,
        roomOptions: null,
    },
};

describe('postToFormValues', () => {
    it('maps the API post onto the form fields, with selects as { value, label } options', () => {
        const values = postToFormValues(post);
        expect(values).toMatchObject({
            title: 'Phòng 1',
            description: 'Phòng đẹp',
            street: '12 Ngõ Hoa',
            roomPrice: 3000000,
            roomQuantity: 2,
            closeBathroom: true,
            haveWaterHeader: true,
            haveAirCondition: false,
            waterElectricity: 'normal',
            roomOption: '',
        });
        expect(values.province).toEqual({ value: 1, label: 'Hà Nội' });
        expect(values.district).toEqual({ value: 2, label: 'Ba Đình' });
        expect(values.ward).toEqual({ value: 3, label: 'Phúc Xá' });
        expect(values.roomType).toEqual({ value: 1, label: 'Phòng trọ' });
        expect(values.roomPaymentType).toEqual({ value: 4, label: 'Tháng' });
        expect(values.roomArea).toEqual({ value: 2, label: '20-30m2' });
        expect(values.kitchenType).toEqual({ value: 5, label: 'Bếp riêng' });
    });

    it('treats a post without state-set prices as rent pricing', () => {
        const values = postToFormValues({
            ...post,
            accommodation: { ...post.accommodation, isStateElectricityPrice: false },
        });
        expect(values.waterElectricity).toBe('rent');
    });
});
