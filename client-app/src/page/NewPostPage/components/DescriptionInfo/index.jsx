import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormLabel, TextareaAutosize } from '@material-ui/core';
// import JoditEditor from 'jodit-react';

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
        handleChange,
        handleBlur,
    } = props;
    return (
        <div class="card mt-4">
            <h5 class="card-header">Thông tin mô tả</h5>
            <div class="card-body">
                <FormGroup>
                    <FormLabel required>Nội dung</FormLabel>
                    <TextareaAutosize
                        name={name}
                        onChange={handleChange}
                        value={
                            defaultValue
                                ? (values.description = defaultValue.content)
                                : values.description
                        }
                        className="form-control"
                        rowsMin={10}
                        placeholder="Viết mô tả về phòng trọ (Tối thiểu 30 ký tự)"
                    />
                    {/* <JoditEditor
                        name={name}
                        // onBlur={(value) => setFieldValue(name, value)}
                        onBlur={(value) =>
                            setFieldValue(name, value.target.innerHTML)
                        }
                        // onBlur={setFieldTouched(name, true)}
                        value={values.description}
                    /> */}
                    {errors.description && touched.description && (
                        <span className="error">{errors.description}</span>
                    )}
                </FormGroup>
            </div>
        </div>
    );
}

export default DescriptionInfo;
