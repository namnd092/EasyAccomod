import React from 'react';

const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-purple-600 text-white hover:bg-purple-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    neutral: 'bg-gray-500 text-white hover:bg-gray-600',
};

const sizes = {
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
};

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...rest }) {
    return (
        <button
            type={type}
            className={`inline-flex cursor-pointer items-center justify-center gap-1 rounded font-medium uppercase tracking-wide shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
            {...rest}
        />
    );
}
