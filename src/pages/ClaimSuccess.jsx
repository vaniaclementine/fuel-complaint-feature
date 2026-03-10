import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { SLA } from '@/lib/constants';
import useInvestigationFlow from '@/lib/useInvestigationFlow';

const ClaimSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const claimId = location.state?.claimId || 'Unknown ID';
    const transactionId = location.state?.transactionId || null;
    const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [showPopup, setShowPopup] = useState(false);

    // Update confetti dimensions on resize
    useEffect(() => {
        const handleResize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show in-app confirmation popup ~1.5s after mount
    useEffect(() => {
        const t = setTimeout(() => setShowPopup(true), 1500);
        return () => clearTimeout(t);
    }, []);

    // Start the 4-stage investigation simulation
    useInvestigationFlow(claimId);

    const handlePopupOk = () => {
        setShowPopup(false);
        navigate('/komplain-bbm/riwayat');
    };

    return (
        <Layout className="justify-center items-center bg-white px-6" showBottomNav={false}>
            <Confetti
                width={windowDimension.width}
                height={windowDimension.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.2}
            />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="text-center w-full"
            >
                <div className="mx-auto bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={56} className="text-primary-green95" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-900 mb-2">Komplain Berhasil Diajukan!</h1>
                <p className="text-neutral-500 text-sm mb-2">
                    Pengajuan komplain Anda telah kami terima dengan nomor
                </p>
                <span className="font-bold text-neutral-900 block mb-2 text-lg bg-neutral-100 px-4 py-2 rounded-lg">{claimId}</span>

                {transactionId && (
                    <div className="mb-6 text-xs text-neutral-500">
                        ID Transaksi: <span className="font-mono font-semibold text-neutral-700">{transactionId}</span>
                    </div>
                )}

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl text-left border border-blue-200 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="text-primary-blue" size={20} />
                        <p className="font-semibold text-sm text-neutral-900">Estimasi Waktu Proses</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
                        <p className="text-xs text-neutral-600">
                            <span className="font-semibold">Klaim akan diproses dalam waktu:</span>
                        </p>
                        <p className="text-lg font-bold text-primary-blue">
                            {SLA.CLAIM_PROCESSING}
                        </p>
                        <p className="text-xs text-neutral-500 mt-2">
                            Anda akan mendapat notifikasi setiap ada pembaruan status klaim.
                        </p>
                    </div>
                </div>

                {/* Notification hint */}
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 text-left">
                    <Bell size={16} className="text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800">
                        Notifikasi progress pengaduan akan muncul secara otomatis. Ketuk notifikasi untuk melihat perkembangan klaim.
                    </p>
                </div>

                <div className="space-y-3 w-full">
                    <Button
                        variant="default"
                        className="w-full shadow-md font-bold text-white bg-[#1B4E9B] hover:bg-[#1B4E9B]/90"
                        onClick={() => navigate('/komplain-bbm/riwayat')}
                    >
                        Lihat Status Klaim
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full text-neutral-500"
                        onClick={() => navigate('/')}
                    >
                        Kembali ke Beranda
                    </Button>
                </div>
            </motion.div>

            {/* In-app Confirmation Popup */}
            <AnimatePresence>
                {showPopup && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        {/* Modal */}
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.85, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 pointer-events-auto">
                                {/* Icon */}
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 size={36} className="text-green-600" />
                                </div>

                                <h2 className="text-lg font-bold text-neutral-900 text-center mb-3">
                                    Pengaduan Berhasil Diterima
                                </h2>
                                <p className="text-sm text-neutral-600 text-center leading-relaxed mb-1">
                                    Kami telah menerima pengaduan Anda.
                                </p>
                                <p className="text-sm text-neutral-600 text-center leading-relaxed mb-1">
                                    Mohon menunggu petugas melakukan investigasi dalam waktu maksimal{' '}
                                    <span className="font-semibold text-[#1B4E9B]">3–5 hari kerja</span>.
                                </p>
                                <p className="text-sm text-neutral-600 text-center leading-relaxed mb-5">
                                    Anda akan mendapatkan notifikasi setiap ada pembaruan status klaim.
                                </p>

                                <div className="bg-neutral-50 rounded-xl p-3 mb-5 text-center">
                                    <p className="text-xs text-neutral-500">Nomor Klaim</p>
                                    <p className="text-base font-bold font-mono text-neutral-900 mt-0.5">{claimId}</p>
                                </div>

                                <Button
                                    variant="default"
                                    className="w-full font-bold text-white bg-[#1B4E9B] hover:bg-[#1B4E9B]/90"
                                    onClick={handlePopupOk}
                                >
                                    OK
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default ClaimSuccess;
