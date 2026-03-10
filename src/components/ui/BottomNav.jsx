import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Scan, Receipt, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationContext';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { unreadCount } = useNotifications();

    const navItems = [
        { id: 'beranda', label: 'Beranda', icon: Home, path: '/' },
        { id: 'pesan', label: 'Pesan', icon: MessageSquare, path: '/pesan', badge: unreadCount },
        { id: 'bayar', label: 'Bayar', icon: Scan, path: '/bayar' },
        { id: 'aktivitas', label: 'Aktivitas', icon: Receipt, path: '/aktivitas' },
        { id: 'bantuan', label: 'Bantuan', icon: HelpCircle, path: '/bantuan' },
    ];

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-neutral-200 z-50">
            <div className="flex justify-around items-center px-1 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex flex-col items-center justify-center px-2 py-2 rounded-lg min-w-[52px] transition-all relative",
                                isActive ? "text-primary-blue" : "text-neutral-400 hover:text-neutral-600"
                            )}
                        >
                            <div className="relative">
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] mt-1 font-medium",
                                isActive ? "font-semibold" : ""
                            )}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
