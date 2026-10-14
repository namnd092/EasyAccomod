import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormLabel, Textarea, inputClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../../ui';
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
        <div className={`${cardClass} mt-6`}>
            <h5 className={cardHeaderClass}>Thông tin mô tả</h5>
            <div className={cardBodyClass}>
                <FormGroup>
                    <FormLabel required>Nội dung</FormLabel>
                    <Textarea
                        name={name}
                        onChange={handleChange}
                        value={
                            defaultValue
                                ? (values.description = defaultValue.content)
                                : values.description
                        }
                        className={inputClass}
                        minRows={10}
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
                        <span className="mt-1 text-sm text-red-600">{errors.description}</span>
                    )}
                </FormGroup>
            </div>
        </div>
    );
}

export default DescriptionInfo;
