import React from 'react';
import { cn } from '@/lib/utils';

const Card = ({ children, className, ...props }) => {
    return (
        <div className={cn("bg-white rounded-xl border border-gray-100 shadow-sm p-4", className)} {...props}>
            {children}
        </div>
    );
};

export default Card;
