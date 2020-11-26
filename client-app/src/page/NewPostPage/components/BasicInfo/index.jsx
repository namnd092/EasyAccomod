import React from 'react'
import PropTypes from 'prop-types'
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Input,
    InputLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@material-ui/core'
import Select from 'react-select'

BasicInfo.propTypes = {
    handleBasicInfoChange: PropTypes.func,
}

function BasicInfo(props) {
    const [waterElectricity, setWaterElectricity] = React.useState('rent')
    const { handleBasicInfoChange } = props
    const [formValues, setFormValues] = React.useState({
        title: null,
        roomType: null,
        province: null,
        district: null,
        ward: null,
        street: null,
        roomPrice: null,
        roomArea: null,
        roomQuantity: null,
        liveWithOwner: false,
        closeBathroom: false,
        haveWaterHeader: false,
        haveAirCondition: false,
        haveBalcony: false,
        waterElectricity: null,
        electricityPrice: null,
        waterPrice: null,
    })
    const handleTitleChange = (value) => {
        setFormValues({...formValues, title: value.target.value});
        handleBasicInfoChange(formValues);
    }
    const handleRoomTypeChange = (value) => {
        setFormValues({...formValues, title: value.target.value});
        handleBasicInfoChange(formValues);
    }
    const handleProvinceChange = (value) => {
        setFormValues({...formValues, title: value.target.value});
        handleBasicInfoChange(formValues);
    }
    const handleDistrictChange = (value) => {
        
    }
    const handleWardChange = (value) => {}
    const handleStreetChange = (value) => {}
    const handleRoomPriceChange = (value) => {}
    const handleRoomAreaChange = (value) => {}
    const handleRoomQuantityChange = (value) => {}
    const handleLiveWithOwnerChange = (value) => {}
    const handleCloseBathroomChange = (value) => {}
    const handleHaveWaterHeaderChange = (value) => {}
    const handleHaveAirConditionChange = (value) => {}
    const handleHaveBalconyChange = (value) => {}
    const handleWaterElectricityChange = (value) => {
        setWaterElectricity(value.target.value)
    }
    const handleElectricityPriceChange = (value) => {}
    const handleWaterPriceChange = (value) => {}

    return (
        <div class="card">
            <h5 class="card-header">Thông tin cơ bản</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel>Tiêu đề</FormLabel>
                    <Input
                        type="text"
                        name="title"
                        onChange={handleTitleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Loại Phòng</FormLabel>
                    <Select name="roomType" onChange={handleRoomTypeChange} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <Select name="province" onChange={handleProvinceChange} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <Select name="district" onChange={handleDistrictChange} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Xã/Phường</FormLabel>
                    <Select name="ward" onChange={handleWardChange} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Số nhà, Đường</FormLabel>
                    <Input
                        type="text"
                        name="street"
                        onChange={handleStreetChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Giá tiền(vnd)</FormLabel>
                    <Input
                        type="number"
                        name="roomPrice"
                        onChange={handleRoomPriceChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Diện tích</FormLabel>
                    <Input
                        type="number"
                        name="roomArea"
                        onChange={handleRoomAreaChange}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Số lượng phòng</FormLabel>
                    <Input
                        type="number"
                        name="roomQuantity"
                        onChange={handleRoomQuantityChange}
                    />
                </FormGroup>
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
                <FormGroup>
                    <FormLabel>Điện nước</FormLabel>
                    <RadioGroup
                        aria-label="gender"
                        name="waterElectricity"
                        value={waterElectricity}
                        onChange={handleWaterElectricityChange}
                    >
                        <FormControlLabel
                            value="rent"
                            control={<Radio />}
                            label="Giá thuê"
                        />
                        <FormControlLabel
                            value="normal"
                            control={<Radio />}
                            label="Giá dân"
                        />
                    </RadioGroup>
                </FormGroup>
                <div
                    style={{
                        display: waterElectricity === 'normal' ? 'none' : '',
                    }}
                >
                    <FormGroup>
                        <FormLabel>Giá điện</FormLabel>
                        <Input
                            type="number"
                            name="electricityPrice"
                            onChange={handleElectricityPriceChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Giá nước</FormLabel>
                        <Input
                            type="number"
                            name="waterPrice"
                            onChange={handleWaterPriceChange}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    )
}

export default BasicInfo
