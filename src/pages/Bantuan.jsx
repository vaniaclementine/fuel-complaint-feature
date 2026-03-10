import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BottomNav from '@/components/ui/BottomNav';
import { useTransactions } from '@/context/TransactionContext';
import { Phone, Send, Video, MessageCircle, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

const Bantuan = () => {
    const navigate = useNavigate();

    const services = [
        {
            id: 'subsidi-tepat',
            icon: '🎯',
            label: 'Subsidi Tepat',
            color: 'bg-blue-500'
        },
        {
            id: 'e-voucher',
            icon: '🎫',
            label: 'E-Voucher',
            color: 'bg-red-400'
        },
        {
            id: 'tukar-poin',
            icon: '⭐',
            label: 'Tukar Poin',
            color: 'bg-amber-400'
        },
        {
            id: 'trip-planner',
            icon: '🧭',
            label: 'Trip Planner',
            color: 'bg-blue-400'
        },
        {
            id: 'layanan-antar',
            icon: '🛵',
            label: 'Layanan Antar',
            color: 'bg-red-500'
        },
        {
            id: 'tagihan-gas',
            icon: '⛽',
            label: 'Tagihan Gas',
            color: 'bg-blue-600'
        },
        {
            id: 'oli',
            icon: '🛢️',
            label: 'Oli',
            color: 'bg-amber-500'
        },
        {
            id: 'akun-anda',
            icon: '👤',
            label: 'Akun Anda',
            color: 'bg-blue-400'
        },
        {
            id: 'pembayaran',
            icon: '💳',
            label: 'Pembayaran',
            color: 'bg-purple-500'
        }
    ];

    const contactMenus = [
        {
            icon: Phone,
            label: 'Contact Center 135',
            onClick: () => { }
        },
        {
            icon: Send,
            label: 'Kirim email ke customer care',
            onClick: () => { }
        },
        {
            icon: Video,
            label: 'Video Call 135',
            onClick: () => { }
        },
        {
            icon: MessageCircle,
            label: 'Chat dengan Nadia',
            onClick: () => { }
        }
    ];


    return (
        <>
            <Layout showBottomNav={true}>
                <div className="p-4 bg-white min-h-screen pb-20">
                    {/* Header */}
                    <h1 className="text-2xl font-bold mb-6">Bantuan</h1>

                    {/* Service Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">
                                    {service.icon}
                                </div>
                                <span className="text-xs text-center text-neutral-700 leading-tight">
                                    {service.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Hubungi Kami Section */}
                    <h2 className="text-lg font-bold mb-3 mt-6">Hubungi Kami</h2>

                    <div className="space-y-2">
                        {contactMenus.map((menu, index) => {
                            const Icon = menu.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={menu.onClick}
                                    className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="text-neutral-600" size={20} />
                                        <span className="text-sm font-medium text-neutral-900">
                                            {menu.label}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className="text-neutral-400" />
                                </button>
                            );
                        })}

                        {/* Ajukan Komplain BBM — always accessible */}
                        <button
                            onClick={() => navigate('/komplain-bbm')}
                            className="w-full p-4 bg-white rounded-xl border border-orange-200 ring-1 ring-orange-100 hover:bg-orange-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-2 bg-orange-50 rounded-full">
                                        <span className="text-xl">⛽</span>
                                    </div>
                                    <div className="text-left flex-1">
                                        <span className="text-sm font-semibold text-neutral-900 block">Ajukan Komplain BBM</span>
                                        <span className="text-xs text-neutral-500 mt-0.5 block">
                                            Laporkan masalah kualitas BBM setelah pengisian
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-orange-500" />
                            </div>
                        </button>
                    </div>
                </div>
            </Layout>
            <BottomNav />
        </>
    );
};

export default Bantuan;
