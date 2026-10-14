const toOption = (id, label) => ({ value: id, label });

// Turns the post returned by the API into the values of the post form, so the form can be pre-filled.
export default function postToFormValues(post) {
    const { accommodation } = post;
    const { address } = accommodation;
    return {
        title: post.title,
        description: post.content,
        roomType: toOption(accommodation.accommodationTypeId, accommodation.accommodationType?.name),
        province: toOption(address.provinceId, address.province?.name),
        district: toOption(address.districtId, address.district?.name),
        ward: toOption(address.wardId, address.ward?.name),
        street: address.street,
        publicLocationNearby: address.publicLocationNearby,
        roomPrice: accommodation.price,
        roomPaymentType: toOption(accommodation.paymentTypeId, accommodation.paymentType?.name),
        roomArea: toOption(accommodation.roomAreaRangeId, accommodation.roomAreaRange?.range),
        roomQuantity: accommodation.roomQuantity,
        liveWithOwner: accommodation.liveWithOwner,
        closeBathroom: accommodation.haveClosedBathroom,
        haveWaterHeader: accommodation.haveWaterHeater,
        haveAirCondition: accommodation.haveAirConditioner,
        haveBalcony: accommodation.haveBalcony,
        waterElectricity: accommodation.isStateElectricityPrice ? 'normal' : 'rent',
        electricityPrice: accommodation.electricityPrice,
        waterPrice: accommodation.waterPrice,
        kitchenType: toOption(accommodation.kitchenTypeId, accommodation.kitchenType?.name),
        roomOption: accommodation.roomOptions ?? '',
        roomImageArr: [],
    };
}
