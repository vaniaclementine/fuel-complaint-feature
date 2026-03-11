import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BottomNav from '@/components/ui/BottomNav';
import { useTransactions } from '@/context/TransactionContext';
import { Phone, Send, Video, MessageCircle, ChevronRight, CheckCircle2, AlertCircle, HeadphonesIcon, HelpCircle, FileText, MapPin, Fuel, CreditCard, Droplets } from 'lucide-react';

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

    const complaintCategories = [
        {
            id: 'harga',
            icon: <FileText size={20} className="text-blue-600" />,
            bg: 'bg-blue-50',
            title: 'Harga & Takaran Pengisian',
            desc: 'Ada masalah ketidaksesuaian harga atau takaran volume pengisian BBM.',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            id: 'ketersediaan',
            icon: <MapPin size={20} className="text-emerald-600" />,
            bg: 'bg-emerald-50',
            title: 'Ketersediaan BBM',
            desc: 'Stok BBM kosong dalam waktu lama atau antrean tidak wajar di SPBU.',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            id: 'kualitas',
            icon: <Droplets size={20} className="text-orange-600" />,
            bg: 'bg-orange-50',
            title: 'Kualitas Produk BBM',
            desc: 'Laporkan masalah kualitas bahan bakar yang mempengaruhi performa kendaraan setelah pengisian.',
            action: () => navigate('/komplain-bbm')
        },
        {
            id: 'operasional',
            icon: <HelpCircle size={20} className="text-purple-600" />,
            bg: 'bg-purple-50',
            title: 'Operasional & Pelayanan SPBU',
            desc: 'Keluhan layanan petugas, fasilitas toilet/mushola kotor, atau mesin rusak.',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            id: 'pembayaran',
            icon: <CreditCard size={20} className="text-cyan-600" />,
            bg: 'bg-cyan-50',
            title: 'Pembayaran & Transaksi',
            desc: 'Gagal scan QR, double claim pembayaran, atau struk tidak tercetak.',
            action: () => alert('Fitur dalam pengembangan')
        }
    ];


    return (
        <>
            <Layout showBottomNav={true}>
                <div className="p-4 bg-white min-h-screen pb-20">
                    {/* Header */}
                    <h1 className="text-2xl font-bold mb-6">Bantuan / Komplain</h1>

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
                    </div>

                    {/* Complaint Categories Section */}
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <HeadphonesIcon className="text-red-500" size={20} />
                            <h2 className="text-lg font-bold text-neutral-900">Kategori Komplain SPBU</h2>
                        </div>
                        <p className="text-sm text-neutral-500 mb-4">Pilih kategori masalah yang Anda hadapi untuk bantuan yang lebih cepat dan tepat.</p>

                        <div className="space-y-3">
                            {complaintCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={cat.action}
                                    className="w-full bg-white rounded-xl border border-neutral-200 p-4 hover:border-red-200 hover:shadow-sm transition-all text-left flex items-start gap-4 active:scale-[0.99]"
                                >
                                    <div className={`p-3 rounded-xl ${cat.bg} shrink-0`}>
                                        {cat.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-neutral-900 mb-1">{cat.title}</h3>
                                        <p className="text-xs text-neutral-500 leading-relaxed">{cat.desc}</p>
                                    </div>
                                    <ChevronRight size={18} className="text-neutral-300 mt-1 shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
            <BottomNav />
        </>
    );
};

export default Bantuan;
