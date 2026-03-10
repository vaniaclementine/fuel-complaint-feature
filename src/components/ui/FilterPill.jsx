import React from 'react';
import { cn } from '@/lib/utils';

const FilterPill = ({ children, active = false, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                active
                    ? "bg-blue-50 text-primary-blue border-2 border-primary-blue"
                    : "bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-400",
                className
            )}
        >
            {children}
        </button>
    );
};

export default FilterPill;
