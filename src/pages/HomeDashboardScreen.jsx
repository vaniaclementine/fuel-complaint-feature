import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BottomNav from '@/components/ui/BottomNav';
import { Button } from '@/components/ui/Button';
import FilterPill from '@/components/ui/FilterPill';
import { User, Scan, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';

const HomeDashboardScreen = () => {
    const navigate = useNavigate();
    const [activePill, setActivePill] = useState('semua');

    const productPills = [
        { id: 'semua', label: 'Semua' },
        { id: 'pertamax-turbo', label: 'Pertamax Turbo' },
        { id: 'pertamax', label: 'Pertamax' },
        { id: 'pertalite', label: 'Pertalite' },
        { id: 'dexlite', label: 'Dexlite' },
    ];

    const fuelPrices = [
        { name: 'Turbo', logo: 'Pertamax Turbo', price: 'Rp 13.400' },
        { name: 'Pertamax', logo: 'Pertamax', price: 'Rp 13.150' },
        { name: 'Pertamax', logo: 'Pertamax', price: 'Rp 12.350' },
        { name: 'Dex', logo: 'Dex', price: 'Rp 13.600' },
    ];

    const services = [
        { id: 'subsidi-tepat', icon: '🎯', label: 'Subsidi\nTepat' },
        { id: 'e-voucher', icon: '🎫', label: 'E-Voucher' },
        { id: 'tukar-poin', icon: '⭐', label: 'Tukar Poin' },
        { id: 'trip-planner', icon: '🧭', label: 'Trip\nPlanner' },
        { id: 'ev-charging', icon: '🔌', label: 'EV\nCharging' },
    ];

    return (
        <>
            <Layout className="bg-gradient-to-b from-blue-50 to-white">
                <div className="flex-1 overflow-y-auto pb-20">
                    {/* Header Row */}
                    <div className="p-4 bg-white flex items-center justify-between sticky top-0 z-10">
                        <img
                            src="https://www.mypertamina.id/static/media/logo-mp.svg"
                            alt="MyPertamina"
                            className="h-10"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/akun-anda')}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                aria-label="Profile"
                            >
                                <User className="text-primary-blue" size={24} />
                            </button>
                            <button
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                aria-label="Scan QR"
                            >
                                <Scan className="text-primary-blue" size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Greeting + Summary */}
                    <div className="px-4 py-6 bg-white">
                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                            Selamat datang, Vania
                        </h2>

                        {/* Summary Cards Row */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {/* Metode Pembayaran */}
                            <div className="min-w-[140px] flex-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white">
                                <div className="text-xs opacity-90 mb-1">Metode Pembayaran</div>
                                <div className="text-base font-bold">Rp 595.996</div>
                            </div>

                            {/* Poin Anda */}
                            <div className="min-w-[100px] bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-3 text-white">
                                <div className="text-xs opacity-90 mb-1">Poin Anda</div>
                                <div className="text-base font-bold">902</div>
                            </div>

                            {/* Member */}
                            <div className="min-w-[100px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 text-white">
                                <div className="text-xs opacity-90 mb-1">Member</div>
                                <div className="text-base font-bold flex items-center gap-1">
                                    🏅 Rookie
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SPBU Search Card */}
                    <div className="px-4 py-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-primary-blue/10 rounded-full">
                                    <MapPin className="text-primary-blue" size={20} />
                                </div>
                                <span className="text-sm font-medium text-neutral-700">
                                    SPBU terdekat dari Anda
                                </span>
                            </div>
                            <Button
                                variant="default"
                                className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white font-semibold"
                            >
                                Cari SPBU
                            </Button>
                        </div>
                    </div>

                    {/* Product Pills Slider */}
                    <div className="px-4 py-2">
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-neutral-100 rounded-full">
                                <ChevronLeft size={20} className="text-neutral-400" />
                            </button>
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                                {productPills.map((pill) => (
                                    <FilterPill
                                        key={pill.id}
                                        active={activePill === pill.id}
                                        onClick={() => setActivePill(pill.id)}
                                    >
                                        {pill.label}
                                    </FilterPill>
                                ))}
                            </div>
                            <button className="p-1 hover:bg-neutral-100 rounded-full">
                                <ChevronRight size={20} className="text-neutral-400" />
                            </button>
                        </div>
                    </div>

                    {/* SPBU Info Card + Fuel Prices */}
                    <div className="px-4 py-4">
                        <div className="bg-white rounded-2xl shadow-md border border-neutral-100 p-4">
                            {/* SPBU Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-neutral-900 mb-1">
                                        31.103.03
                                    </h3>
                                    <p className="text-xs text-neutral-600 leading-relaxed">
                                        Jl.Cikini Raya Kel.Cikini Kec.Menteng, Jakarta Pusat
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-neutral-200 rounded-full text-xs">
                                            ♿
                                        </span>
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-neutral-200 rounded-full text-xs">
                                            🏪
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 bg-primary-blue rounded-lg">
                                    <MapPin className="text-white" size={20} />
                                </button>
                            </div>

                            {/* Fuel Prices Mini Cards */}
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {fuelPrices.map((fuel, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-neutral-50 rounded-lg p-2 text-center border border-neutral-200"
                                    >
                                        <div className="text-[10px] font-bold text-red-600 mb-1">
                                            {fuel.logo.split(' ')[0]}
                                        </div>
                                        <div className="text-[9px] font-semibold text-neutral-900">
                                            {fuel.price}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="text-primary-blue text-xs font-semibold flex items-center gap-1">
                                Lihat selengkapnya
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Banner — Fuel Complaint */}
                    <div className="px-4 py-4">
                        <button
                            onClick={() => navigate('/komplain-bbm')}
                            className="w-full text-left"
                        >
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow active:scale-[0.99]">
                                <div className="text-3xl">⛽</div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">Ada masalah dengan BBM?</p>
                                    <p className="text-xs text-white/90 mt-0.5">Ajukan komplain & pantau status klaim Anda</p>
                                </div>
                                <ChevronRight size={18} className="text-white/80" />
                            </div>
                        </button>
                    </div>

                    {/* Jelajah Layanan */}
                    <div className="px-4 py-4 bg-white">
                        <h3 className="text-base font-bold text-neutral-900 mb-4">
                            Jelajah Layanan
                        </h3>
                        <div className="grid grid-cols-5 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl group-hover:shadow-md transition-shadow border border-neutral-100">
                                        {service.icon}
                                    </div>
                                    <span className="text-[10px] text-center text-neutral-700 leading-tight whitespace-pre-line">
                                        {service.label}
                                    </span>
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

export default HomeDashboardScreen;
