import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { useNotifications } from '@/context/NotificationContext';
import { Bell, BellOff, CheckCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatTimestamp = (isoString) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return `${diff}d lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
    return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const typeColors = {
    complaint_submission: 'bg-blue-100 text-blue-700',
    complaint_verifying: 'bg-amber-100 text-amber-700',
    complaint_processing: 'bg-orange-100 text-orange-700',
    complaint_investigation: 'bg-purple-100 text-purple-700',
    complaint_approved: 'bg-green-100 text-green-700',
    complaint_rejected: 'bg-red-100 text-red-700',
    rebuttal_submitted: 'bg-sky-100 text-sky-700',
    rebuttal_reviewing: 'bg-violet-100 text-violet-700',
    rebuttal_accepted: 'bg-emerald-100 text-emerald-700',
    rebuttal_rejected: 'bg-rose-100 text-rose-700',
};

const TypeIcon = ({ type }) => {
    const colors = typeColors[type] || 'bg-neutral-100 text-neutral-500';
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}>
            <Bell size={18} />
        </div>
    );
};

/** Returns a time-bucket label for a given ISO timestamp */
const getTimeBucket = (isoString) => {
    const now = new Date();
    const d = new Date(isoString);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday - 86_400_000);
    const startOfWeek = new Date(startOfToday - 6 * 86_400_000);

    if (d >= startOfToday) return 'Hari ini';
    if (d >= startOfYesterday) return 'Kemarin';
    if (d >= startOfWeek) return 'Minggu ini';
    return 'Lebih lama';
};

const BUCKET_ORDER = ['Hari ini', 'Kemarin', 'Minggu ini', 'Lebih lama'];

const PesanPage = () => {
    const navigate = useNavigate();
    const { notifications, markRead, markAllRead, unreadCount } = useNotifications();

    const handleNotifClick = (notif) => {
        markRead(notif.id);
        if (notif.deepLink) navigate(notif.deepLink);
    };

    // Sort newest → oldest, then group into time buckets
    const grouped = useMemo(() => {
        const sorted = [...notifications].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        const map = {};
        sorted.forEach(n => {
            const bucket = getTimeBucket(n.timestamp);
            if (!map[bucket]) map[bucket] = [];
            map[bucket].push(n);
        });
        return BUCKET_ORDER.filter(b => map[b]).map(b => ({ bucket: b, items: map[b] }));
    }, [notifications]);

    return (
        <Layout showBottomNav={true}>
            <Header title="Pesan" />

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

            <div className="pb-24">
                <AnimatePresence initial={false}>
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                <BellOff size={36} className="text-neutral-300" />
                            </div>
                            <p className="text-neutral-400 text-sm">Belum ada notifikasi.</p>
                        </div>
                    ) : (
                        grouped.map(({ bucket, items }) => (
                            <div key={bucket}>
                                {/* Sticky section header */}
                                <div className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-100 px-4 py-1.5">
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">
                                        {bucket}
                                    </span>
                                </div>

                                <div className="divide-y divide-neutral-100">
                                    {items.map((notif, idx) => (
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

                                            <TypeIcon type={notif.type} />

                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className={`text-sm font-semibold leading-tight mb-0.5 ${notif.read ? 'text-neutral-700' : 'text-neutral-900'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-1">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-[10px] text-neutral-400">
                                                        {new Date(notif.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-300">·</span>
                                                    <span className="text-[10px] text-neutral-400">
                                                        {formatTimestamp(notif.timestamp)}
                                                    </span>
                                                    {notif.claimId && (
                                                        <>
                                                            <span className="text-[10px] text-neutral-300">·</span>
                                                            <span className="text-[10px] font-mono text-neutral-400">{notif.claimId}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight size={14} className="text-neutral-300 flex-shrink-0 mt-1" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default PesanPage;
