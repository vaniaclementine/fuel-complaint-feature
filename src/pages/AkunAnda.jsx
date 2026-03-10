import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ArrowLeft, Edit2, ChevronRight } from 'lucide-react';

const AkunAnda = () => {
    const navigate = useNavigate();

    const menuSections = {
        lainnya: [
            { id: 'ganti-pin', label: 'Ganti PIN', path: '/ganti-pin' },
            { id: 'bantuan', label: 'Bantuan', path: '/bantuan' },
            { id: 'komplain-bbm', label: 'Komplain BBM', path: '/komplain-bbm', highlighted: true },
            { id: 'tentang', label: 'Tentang MyPertamina', path: '/tentang' },
        ],
        komunikasiPrivasi: [
            { id: 'notifikasi', label: 'Notifikasi', path: '/notifikasi' },
            { id: 'privasi', label: 'Pengaturan Privasi', path: '/privasi' },
        ],
    };

    return (
        <Layout className="bg-neutral-50">
            <div className="flex-1 overflow-y-auto">
                {/* Top Bar */}
                <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 border-b border-neutral-100">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-neutral-900" />
                    </button>
                    <h1 className="text-lg font-semibold text-neutral-900">Akun Anda</h1>
                </div>

                <div className="p-4 space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden">
                                <svg className="w-10 h-10 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h2 className="text-base font-bold text-neutral-900">Vania Clementine</h2>
                                <p className="text-sm text-neutral-600 mt-0.5">08117197766</p>
                                <button className="text-sm text-primary-blue font-medium mt-1">
                                    Hubungkan Email
                                </button>
                            </div>

                            {/* Edit Icon */}
                            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <Edit2 size={18} className="text-primary-blue" />
                            </button>
                        </div>

                        {/* Paspor Digital */}
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                            <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://www.mypertamina.id/static/media/logo-mp.svg"
                                        alt="MyPertamina"
                                        className="h-6"
                                    />
                                    <span className="text-sm font-semibold text-primary-blue">
                                        Paspor Digital
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-blue-600">✓</span>
                                    <ChevronRight size={16} className="text-primary-blue" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Poin & Voucher Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Poin MyPertamina */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="text-xs text-neutral-600 mb-1">Poin MyPertamina</div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-amber-500 text-xl">⭐</span>
                                <span className="text-2xl font-bold text-neutral-900">902</span>
                            </div>
                            <button className="text-xs text-primary-blue font-semibold">
                                Cek Poin Anda
                            </button>
                        </div>

                        {/* Voucher Anda */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <div className="text-xs text-neutral-600 mb-1">Voucher Anda</div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-blue-500 text-xl">🎫</span>
                                <span className="text-2xl font-bold text-neutral-900">10</span>
                            </div>
                            <button className="text-xs text-primary-blue font-semibold">
                                Cek Voucher Anda
                            </button>
                        </div>
                    </div>

                    {/* Subsidi Tepat Section */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-3">Subsidi Tepat</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-sm">🎯</span>
                                    </div>
                                    <span className="text-sm text-neutral-900">Profil Subsidi Tepat</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs">
                                        !
                                    </span>
                                    <ChevronRight size={16} className="text-neutral-400" />
                                </div>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-sm">🚗</span>
                                    </div>
                                    <span className="text-sm text-neutral-900">Kendaraan Anda</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 text-xs">
                                        0
                                    </span>
                                    <ChevronRight size={16} className="text-neutral-400" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Informasi Pribadi */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-3">Informasi Pribadi</h3>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                            <span className="text-sm text-neutral-900">Email</span>
                            <ChevronRight size={16} className="text-neutral-400" />
                        </button>
                    </div>

                    {/* Pembayaran dan Transaksi */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-3">Pembayaran dan Transaksi</h3>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                            <span className="text-sm text-neutral-900">Lihat Riwayat Transaksi</span>
                            <ChevronRight size={16} className="text-neutral-400" />
                        </button>
                    </div>

                    {/* Lainnya Section */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-3">Lainnya</h3>
                        <div className="space-y-1">
                            {menuSections.lainnya.map((menu) => (
                                <button
                                    key={menu.id}
                                    onClick={() => navigate(menu.path)}
                                    className={`w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors ${menu.highlighted ? 'bg-orange-50 hover:bg-orange-100' : ''}`}
                                >
                                    <span className={`text-sm ${menu.highlighted ? 'text-orange-600 font-semibold' : 'text-neutral-900'}`}>
                                        {menu.highlighted && '⛽ '}{menu.label}
                                    </span>
                                    <ChevronRight size={16} className={menu.highlighted ? 'text-orange-500' : 'text-neutral-400'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Komunikasi & Privasi */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-neutral-900 mb-3">Komunikasi & Privasi</h3>
                        <div className="space-y-1">
                            {menuSections.komunikasiPrivasi.map((menu) => (
                                <button
                                    key={menu.id}
                                    onClick={() => navigate(menu.path)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors"
                                >
                                    <span className="text-sm text-neutral-900">{menu.label}</span>
                                    <ChevronRight size={16} className="text-neutral-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hapus dan Keluar */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors">
                            <span className="text-sm text-red-600 font-medium">Keluar</span>
                            <ChevronRight size={16} className="text-red-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors mt-1">
                            <span className="text-sm text-red-600 font-medium">Hapus Akun</span>
                            <ChevronRight size={16} className="text-red-400" />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AkunAnda;
