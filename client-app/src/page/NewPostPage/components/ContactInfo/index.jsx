import React from 'react';
import { FormGroup, FormLabel, Input } from '@material-ui/core';

ContactInfo.propTypes = {};

function ContactInfo(props) {
    const { handleContactInfoChange } = props;
    const [contactValues, setContactValues] = React.useState({
        name: '',
        phone: '',
        email: '',
        ownerAddress: '',
    });

    const handleNameBlur = (value) => {
        const name = value.target.value;
        setContactValues({ ...contactValues, name });
        handleContactInfoChange(contactValues);
    };
    const handlePhoneBlur = (value) => {
        const phone = value.target.value;
        setContactValues({ ...contactValues, phone });
        handleContactInfoChange(contactValues);
    };
    const handleEmailBlur = (value) => {
        const email = value.target.value;
        setContactValues({ ...contactValues, email });
        handleContactInfoChange(contactValues);
    };
    const handleOwnerAddressBlur = (value) => {
        const ownerAddress = value.target.value;
        setContactValues({ ...contactValues, ownerAddress });
        handleContactInfoChange(contactValues);
    };

    return (
        <div>
            <div class="card">
                <h5 class="card-header">Thông tin liên hệ</h5>
                <div class="card-body">
                    <FormGroup>
                        <FormLabel>Tên</FormLabel>
                        <Input name="name" onBlur={handleNameBlur} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>SDT</FormLabel>
                        <Input name="phone" onBlur={handlePhoneBlur} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" onBlur={handleEmailBlur} />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Địa chỉ</FormLabel>
                        <Input
                            name="ownerAddress"
                            onBlur={handleOwnerAddressBlur}
                        />
                    </FormGroup>
                </div>
            </div>
        </div>
    );
}

export default ContactInfo;
