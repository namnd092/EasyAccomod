import React from 'react';
import Select from 'react-select';
const MySelect = (props) => {
    const { name, options, values, onChange, onBlur, defaultValue } = props;
    const handleChange = (value) => {
        onChange(name, value);
    };
    const handleBlur = (value) => {
        onBlur(name, true);
    };
    return (
        <div>
            <Select
                options={options}
                value={values}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}
                defaultValue={defaultValue}
            />
        </div>
    );
};

export default MySelect;
