import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormLabel } from '@material-ui/core';
import JoditEditor from 'jodit-react';

DescriptionInfo.propTypes = {
    handleDescriptionInfoChange: PropTypes.func,
};

function DescriptionInfo(props) {
    const {
        defaultValue,
        setFieldValue,
        name,
        values,
        errors,
        touched,
    } = props;
    return (
        <div class="card mt-4">
            <h5 class="card-header">Thông tin mô tả</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel required>Nội dung</FormLabel>
                    <JoditEditor
                        name={name}
                        // onBlur={(value) => setFieldValue(name, value)}
                        onBlur={(value) =>
                            setFieldValue(name, value.target.innerHTML)
                        }
                        // onBlur={setFieldTouched(name, true)}
                        value={values.description}
                    />
                    {errors.description && touched.description && (
                        <span>{errors.description}</span>
                    )}
                </FormGroup>
            </div>
        </div>
    );
}

export default DescriptionInfo;
