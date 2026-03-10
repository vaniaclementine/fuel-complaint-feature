import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/context/NotificationContext';
import { Bell, BellOff, CheckCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatRelative = (isoString) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return `${diff}d lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
    return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const typeColors = {
    complaint_submission: 'bg-blue-100 text-blue-700',
    complaint_verifying: 'bg-amber-100 text-amber-700',
    complaint_processing: 'bg-orange-100 text-orange-700',
    complaint_investigation: 'bg-purple-100 text-purple-700',
    complaint_approved: 'bg-green-100 text-green-700',
    complaint_rejected: 'bg-red-100 text-red-700',
};

const typeIcon = (type) => {
    const colors = typeColors[type] || 'bg-neutral-100 text-neutral-500';
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}>
            <Bell size={18} />
        </div>
    );
};

const NotificationInboxPage = () => {
    const navigate = useNavigate();
    const { notifications, markRead, markAllRead, unreadCount } = useNotifications();

    const handleNotifClick = (notif) => {
        markRead(notif.id);
        if (notif.deepLink) navigate(notif.deepLink);
    };

    return (
        <Layout showBottomNav={true}>
            <Header title="Notifikasi" />

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100">
                <p className="text-xs text-neutral-500">
                    {unreadCount > 0 ? (
                        <span className="text-[#1B4E9B] font-semibold">{unreadCount} belum dibaca</span>
                    ) : (
                        'Semua sudah dibaca'
                    )}
                </p>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs text-[#1B4E9B] font-semibold hover:underline"
                    >
                        <CheckCheck size={13} />
                        Tandai Semua Dibaca
                    </button>
                )}
            </div>

            <div className="divide-y divide-neutral-100">
                <AnimatePresence initial={false}>
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                <BellOff size={36} className="text-neutral-300" />
                            </div>
                            <p className="text-neutral-400 text-sm">Belum ada notifikasi.</p>
                        </div>
                    ) : (
                        notifications.map((notif, idx) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                onClick={() => handleNotifClick(notif)}
                                className={`flex items-start gap-3 px-4 py-4 cursor-pointer hover:bg-neutral-50 transition-colors relative ${!notif.read ? 'bg-blue-50/50' : ''}`}
                            >
                                {/* Unread dot */}
                                {!notif.read && (
                                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#1B4E9B]" />
                                )}

                                {typeIcon(notif.type)}

                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className={`text-sm font-semibold leading-tight ${notif.read ? 'text-neutral-700' : 'text-neutral-900'}`}>
                                            {notif.title}
                                        </p>
                                    </div>
                                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-1">
                                        {notif.message}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-neutral-400">{formatRelative(notif.timestamp)}</span>
                                        {notif.claimId && (
                                            <span className="text-[10px] font-mono text-neutral-400">· {notif.claimId}</span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-neutral-300 flex-shrink-0 mt-1" />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default NotificationInboxPage;
