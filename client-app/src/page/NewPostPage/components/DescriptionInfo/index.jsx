import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormGroup, FormLabel, FieldError, Textarea, inputClass, cardClass, cardHeaderClass, cardBodyClass } from '../../../../ui';

function DescriptionInfo() {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    return (
        <div className={`${cardClass} mt-6`}>
            <h5 className={cardHeaderClass}>Thông tin mô tả</h5>
            <div className={cardBodyClass}>
                <FormGroup>
                    <FormLabel required htmlFor="field-description">
                        Nội dung
                    </FormLabel>
                    <Textarea
                        id="field-description"
                        className={inputClass}
                        rows={10}
                        placeholder="Viết mô tả về phòng trọ (Tối thiểu 30 ký tự)"
                        {...register('description')}
                    />
                    <FieldError error={errors.description} />
                </FormGroup>
            </div>
        </div>
    );
}

export default DescriptionInfo;
