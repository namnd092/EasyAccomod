import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormLabel } from '@material-ui/core';
import JoditEditor from 'jodit-react';

DescriptionInfo.propTypes = {
    handleDescriptionInfoChange: PropTypes.func,
};

function DescriptionInfo(props) {
    const { handleDescriptionInfoChange, defaultValue } = props;
    const handleDescriptionChange = (value) => {
        const description = value.target.innerHTML;
        handleDescriptionInfoChange({ description });
    };
    return (
        <div class="card mt-4">
            <h5 class="card-header">Thông tin mô tả</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel required>Nội dung</FormLabel>
                    <JoditEditor
                        onBlur={handleDescriptionChange}
                        value={defaultValue}
                    />
                </FormGroup>
            </div>
        </div>
    );
}

export default DescriptionInfo;
