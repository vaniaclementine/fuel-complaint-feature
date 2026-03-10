import React from 'react';

const Layout = ({ children, className, showBottomNav = true }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex justify-center">
            <div className={`w-full max-w-[480px] bg-white min-h-screen shadow-xl relative flex flex-col ${showBottomNav ? 'pb-16' : ''} ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
