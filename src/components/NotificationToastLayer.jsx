import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

// Map notification type → accent colour class
const TYPE_ACCENT = {
    complaint_submission: 'bg-blue-500',
    complaint_verifying: 'bg-amber-500',
    complaint_processing: 'bg-orange-500',
    complaint_investigation: 'bg-purple-500',
    complaint_approved: 'bg-green-500',
    complaint_rejected: 'bg-red-500',
    rebuttal_submitted: 'bg-sky-500',
    rebuttal_reviewing: 'bg-violet-500',
    rebuttal_accepted: 'bg-emerald-500',
    rebuttal_rejected: 'bg-rose-500',
};

const TYPE_ICON_COLOR = {
    complaint_submission: 'text-blue-600',
    complaint_verifying: 'text-amber-600',
    complaint_processing: 'text-orange-600',
    complaint_investigation: 'text-purple-600',
    complaint_approved: 'text-green-600',
    complaint_rejected: 'text-red-600',
    rebuttal_submitted: 'text-sky-600',
    rebuttal_reviewing: 'text-violet-600',
    rebuttal_accepted: 'text-emerald-600',
    rebuttal_rejected: 'text-rose-600',
};

/** Pertamina flame logo (inline SVG) used as the app icon in the banner */
const PertaminaIcon = () => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="40" height="40" rx="10" fill="#1B4E9B" />
        <path
            d="M20 8 C20 8 12 14 12 21 C12 25.4 15.6 29 20 29 C24.4 29 28 25.4 28 21 C28 14 20 8 20 8Z"
            fill="white" opacity="0.9"
        />
        <path
            d="M20 14 C20 14 15 18 15 22 C15 24.8 17.2 27 20 27 C22.8 27 25 24.8 25 22 C25 18 20 14 20 14Z"
            fill="#E8A020"
        />
        <path
            d="M20 18 C20 18 17.5 20.5 17.5 22.5 C17.5 24 18.6 25 20 25 C21.4 25 22.5 24 22.5 22.5 C22.5 20.5 20 18 20 18Z"
            fill="white" opacity="0.85"
        />
    </svg>
);

const formatNow = () => {
    const d = new Date();
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// Auto-dismiss duration in ms (must match NotificationContext)
const TOAST_DURATION = 6000;

const NotificationToastLayer = () => {
    const { toastQueue, dismissToast, markRead } = useNotifications();
    const navigate = useNavigate();

    const handleTap = (toast) => {
        markRead(toast.id);
        dismissToast(toast.id);
        if (toast.deepLink) navigate(toast.deepLink);
    };

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[9999] pointer-events-none px-3 pt-3 space-y-2">
            <AnimatePresence initial={false}>
                {toastQueue.map((toast) => {
                    const accent = TYPE_ACCENT[toast.type] || 'bg-[#1B4E9B]';
                    const iconColor = TYPE_ICON_COLOR[toast.type] || 'text-[#1B4E9B]';

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -72, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -48, scale: 0.94 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="pointer-events-auto"
                        >
                            <div
                                className="relative bg-white/96 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-neutral-200/60 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                                onClick={() => handleTap(toast)}
                            >
                                {/* Left accent stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />

                                {/* Auto-dismiss progress bar at bottom */}
                                <motion.div
                                    className={`absolute bottom-0 left-0 h-[2px] ${accent} opacity-30`}
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: TOAST_DURATION / 1000, ease: 'linear' }}
                                />

                                {/* App header row */}
                                <div className="flex items-center gap-2 pl-4 pr-3 pt-2.5 pb-1">
                                    {/* App icon */}
                                    <div className="w-5 h-5 rounded-[6px] overflow-hidden flex-shrink-0 shadow-sm">
                                        <PertaminaIcon />
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase flex-1">
                                        MyPertamina
                                    </span>
                                    <span className="text-[10px] text-neutral-400 tabular-nums">
                                        {formatNow()}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); dismissToast(toast.id); }}
                                        className="text-neutral-300 hover:text-neutral-500 transition-colors ml-0.5 p-0.5 rounded-full"
                                        aria-label="Tutup notifikasi"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>

                                {/* Content row */}
                                <div className="pl-4 pr-4 pb-3 flex items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-neutral-900 leading-snug">
                                            {toast.title}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
                                            {toast.message}
                                        </p>
                                        {toast.claimId && (
                                            <p className={`text-[10px] font-mono font-semibold mt-1 ${iconColor}`}>
                                                {toast.claimId} · Ketuk untuk detail
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToastLayer;
