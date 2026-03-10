import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

let _notifId = 100; // start above seed IDs to avoid collisions

// Historical notifications for existing mock claims (newest first)
const SEED_NOTIFICATIONS = [
    // CLM-9876 — Approved (done)
    {
        id: 10, timestamp: '2026-01-24T14:00:00', read: true,
        type: 'complaint_approved', claimId: 'CLM-9876',
        title: 'Klaim Anda Disetujui ✅',
        message: 'Pengaduan Anda telah diverifikasi dan disetujui. Kompensasi akan diproses sesuai ketentuan yang berlaku.',
        deepLink: '/komplain-bbm/CLM-9876', category: 'Complaint',
    },
    {
        id: 9, timestamp: '2026-01-22T10:00:00', read: true,
        type: 'complaint_investigation', claimId: 'CLM-9876',
        title: 'Investigasi Sedang Dilakukan',
        message: 'Tim Pertamina sedang melakukan investigasi terkait pengaduan Anda. Proses ini dapat melibatkan pengecekan di SPBU terkait.',
        deepLink: '/komplain-bbm/CLM-9876', category: 'Complaint',
    },
    {
        id: 8, timestamp: '2026-01-21T08:00:00', read: true,
        type: 'complaint_processing', claimId: 'CLM-9876',
        title: 'Pengaduan Sedang Diproses',
        message: 'Verifikasi data Anda telah selesai. Pengaduan kini sedang diproses lebih lanjut oleh tim kami.',
        deepLink: '/komplain-bbm/CLM-9876', category: 'Complaint',
    },
    {
        id: 7, timestamp: '2026-01-20T11:00:00', read: true,
        type: 'complaint_verifying', claimId: 'CLM-9876',
        title: 'Pengaduan Sedang Diverifikasi',
        message: 'Pengaduan Anda sedang melalui proses verifikasi awal. Kami sedang memastikan detail transaksi dan bukti yang Anda lampirkan.',
        deepLink: '/komplain-bbm/CLM-9876', category: 'Complaint',
    },
    {
        id: 6, timestamp: '2026-01-20T10:30:00', read: true,
        type: 'complaint_submission', claimId: 'CLM-9876',
        title: 'Pengaduan Berhasil Diterima',
        message: 'Pengaduan Anda dengan nomor CLM-9876 telah kami terima. Tim kami akan melakukan verifikasi awal sebelum proses investigasi.',
        deepLink: '/komplain-bbm/CLM-9876', category: 'Complaint',
    },
    // CLM-9875 — In progress (process)
    {
        id: 5, timestamp: '2026-01-23T09:00:00', read: true,
        type: 'complaint_processing', claimId: 'CLM-9875',
        title: 'Pengaduan Sedang Diproses',
        message: 'Verifikasi data Anda telah selesai. Pengaduan CLM-9875 kini sedang diproses lebih lanjut oleh tim kami.',
        deepLink: '/komplain-bbm/CLM-9875', category: 'Complaint',
    },
    {
        id: 4, timestamp: '2026-01-22T14:15:00', read: true,
        type: 'complaint_submission', claimId: 'CLM-9875',
        title: 'Pengaduan Berhasil Diterima',
        message: 'Pengaduan Anda dengan nomor CLM-9875 telah kami terima. Tim kami akan melakukan verifikasi awal sebelum proses investigasi.',
        deepLink: '/komplain-bbm/CLM-9875', category: 'Complaint',
    },
    // CLM-9874 — Rejected
    {
        id: 3, timestamp: '2026-01-22T16:30:00', read: false,
        type: 'complaint_rejected', claimId: 'CLM-9874',
        title: 'Klaim Tidak Dapat Diproses ❌',
        message: 'Setelah dilakukan investigasi, pengaduan Anda belum dapat disetujui. Anda dapat mengajukan sanggahan dalam waktu 3 hari.',
        deepLink: '/komplain-bbm/CLM-9874', category: 'Complaint',
    },
    // CLM-9873 — Rejected
    {
        id: 2, timestamp: '2026-01-15T14:00:00', read: false,
        type: 'complaint_rejected', claimId: 'CLM-9873',
        title: 'Klaim Tidak Dapat Diproses ❌',
        message: 'Setelah dilakukan investigasi, pengaduan Anda belum dapat disetujui. Anda dapat mengajukan sanggahan dalam waktu 3 hari.',
        deepLink: '/komplain-bbm/CLM-9873', category: 'Complaint',
    },
];

export const NotificationProvider = ({ children }) => {
    // Inbox: all received notifications (newest first)
    const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
    // Active toast queue (visible banners)
    const [toastQueue, setToastQueue] = useState([]);

    /**
     * Push a new notification to inbox AND show a toast.
     * @param {Object} notif - { type, claimId, title, message, deepLink }
     */
    const addNotification = useCallback((notif) => {
        const id = _notifId++;
        const timestamp = new Date().toISOString();
        const entry = { id, timestamp, read: false, ...notif };

        setNotifications(prev => [entry, ...prev]);

        // Show toast
        setToastQueue(prev => [...prev, entry]);
        // Auto-remove toast after 6 s
        setTimeout(() => {
            setToastQueue(prev => prev.filter(t => t.id !== id));
        }, 6000);
    }, []);

    const dismissToast = useCallback((id) => {
        setToastQueue(prev => prev.filter(t => t.id !== id));
    }, []);

    const markRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            toastQueue,
            unreadCount,
            addNotification,
            dismissToast,
            markRead,
            markAllRead,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
