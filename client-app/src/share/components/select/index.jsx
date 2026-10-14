import React from 'react';
import Select from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';

// A react-select bound to the surrounding react-hook-form field `name`.
// `onChange` is called with the chosen option after the form value is updated.
const MySelect = ({ name, options, onChange, inputId }) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    ref={field.ref}
                    inputId={inputId}
                    name={name}
                    options={options}
                    value={field.value}
                    onChange={(option) => {
                        field.onChange(option);
                        onChange?.(option);
                    }}
                    onBlur={field.onBlur}
                />
            )}
        />
    );
};

export default MySelect;
