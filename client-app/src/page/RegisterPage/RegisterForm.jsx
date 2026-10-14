import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, FormLabel, FieldError, inputClass } from '../../ui';

// `fields` are shown one per row, `halfFields` side by side underneath them.
export default function RegisterForm({ fields, halfFields = [], defaultValues, schema, onSubmit }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues, resolver: yupResolver(schema), mode: 'onTouched' });

    const renderField = ({ name, label, type = 'text' }, className) => (
        <FormGroup key={name} className={className}>
            <FormLabel htmlFor={`register-${name}`}>{label}</FormLabel>
            <input id={`register-${name}`} type={type} className={inputClass} {...register(name)} />
            <FieldError error={errors[name]} />
        </FormGroup>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field) => renderField(field))}
            {halfFields.length > 0 && (
                <div className="grid grid-cols-12 gap-x-4">
                    {halfFields.map((field) => renderField(field, 'col-span-6'))}
                </div>
            )}
            <div className="mt-5 flex justify-between px-5">
                <Button className="h-10 w-[150px]" variant="secondary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </Button>
                <Button className="h-10 w-[150px]" type="submit" disabled={isSubmitting}>
                    Đăng ký
                </Button>
            </div>
        </form>
    );
}
