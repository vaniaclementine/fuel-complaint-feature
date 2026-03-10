import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = ({ title, showBack = true, className }) => {
    const navigate = useNavigate();

    return (
        <header className={cn("flex items-center p-4 bg-white sticky top-0 z-10", className)}>
            {showBack && (
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900 flex-1">{title}</h1>
        </header>
    );
};

export default Header;
