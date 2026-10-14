import React from 'react';

export function FormGroup({ className = '', ...rest }) {
    return <div className={`mb-4 flex flex-col ${className}`} {...rest} />;
}

export function FormLabel({ required, children, className = '', ...rest }) {
    return (
        <label className={`mb-2 inline-block ${className}`} {...rest}>
            {children}
            {required && <span aria-hidden="true"> *</span>}
        </label>
    );
}

export function Checkbox({ className = '', ...rest }) {
    return <input type="checkbox" className={`h-5 w-5 cursor-pointer accent-blue-600 ${className}`} {...rest} />;
}

export function Radio({ className = '', ...rest }) {
    return <input type="radio" className={`h-4 w-4 cursor-pointer accent-blue-600 ${className}`} {...rest} />;
}

export function Textarea({ className = '', ...rest }) {
    return <textarea className={className} {...rest} />;
}
