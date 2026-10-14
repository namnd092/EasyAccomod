import React from 'react';

// Read-only star rating in half-star steps.
export function Rating({ value, size = 'md', className = '' }) {
    const rounded = Math.round((Number(value) || 0) * 2) / 2;
    const stars = [1, 2, 3, 4, 5].map((n) => {
        if (rounded >= n) return 'fas fa-star text-amber-400';
        if (rounded >= n - 0.5) return 'fas fa-star-half-alt text-amber-400';
        return 'far fa-star text-gray-400';
    });
    return (
        <span
            role="img"
            aria-label={`${rounded} trên 5 sao`}
            className={`inline-flex gap-0.5 ${size === 'small' ? 'text-sm' : 'text-lg'} ${className}`}
        >
            {stars.map((icon, i) => (
                <i key={i} className={icon} aria-hidden="true"></i>
            ))}
        </span>
    );
}
