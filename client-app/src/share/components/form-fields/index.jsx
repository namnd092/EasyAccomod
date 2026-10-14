import React from 'react';
import { useFormContext } from 'react-hook-form';
import MySelect from '../select';
import { numberOrEmpty } from '../../../utils/formHelpers';
import { FormGroup, FormLabel, FieldError, Checkbox, inputClass } from '../../../ui';

// Form rows bound to the surrounding react-hook-form context (see FormProvider).

export function InputField({ label, name, type = 'text', className = '' }) {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const id = `field-${name}`;
    return (
        <FormGroup className={className}>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <input
                id={id}
                type={type}
                className={inputClass}
                {...register(name, type === 'number' ? { setValueAs: numberOrEmpty } : undefined)}
            />
            <FieldError error={errors[name]} />
        </FormGroup>
    );
}

export function SelectField({ label, name, options, className = '', onChange }) {
    const {
        formState: { errors },
    } = useFormContext();
    const id = `field-${name}`;
    return (
        <FormGroup className={className}>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <MySelect name={name} options={options} inputId={id} onChange={onChange} />
            <FieldError error={errors[name]} />
        </FormGroup>
    );
}

export function CheckboxField({ label, name }) {
    const { register } = useFormContext();
    const id = `field-${name}`;
    return (
        <FormGroup>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <Checkbox id={id} {...register(name)} />
        </FormGroup>
    );
}
