import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { ChevronRight, FileText, MapPin, Droplets, HelpCircle, CreditCard } from 'lucide-react';

const KomplainSPBU = () => {
    const navigate = useNavigate();

    const complaintCategories = [
        {
            id: 'harga',
            icon: <FileText size={24} className="text-blue-600" />,
            bg: 'bg-blue-50',
            title: 'Harga & Takaran Pengisian',
            desc: 'Ketidaksesuaian nominal pembayaran atau volume pengisian BBM.',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            id: 'ketersediaan',
            icon: <MapPin size={24} className="text-emerald-600" />,
            bg: 'bg-emerald-50',
            title: 'Ketersediaan BBM',
            desc: 'BBM tidak tersedia, stok kosong, atau produk tidak tersedia di SPBU.',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            id: 'kualitas',
            icon: <Droplets size={24} className="text-orange-600" />,
            bg: 'bg-orange-50',
            title: 'Kualitas Produk BBM',
            desc: 'Masalah kualitas BBM yang mempengaruhi performa kendaraan setelah pengisian.',
            action: () => navigate('/komplain-bbm') // Routes to existing fuel complaint module
        },
        {
            id: 'operasional',
            icon: <HelpCircle size={24} className="text-purple-600" />,
            bg: 'bg-purple-50',
            title: 'Operasional & Pelayanan SPBU',
            desc: 'Kendala layanan petugas, kepatuhan SOP, atau operasional SPBU.',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            id: 'pembayaran',
            icon: <CreditCard size={24} className="text-cyan-600" />,
            bg: 'bg-cyan-50',
            title: 'Pembayaran & Transaksi',
            desc: 'Masalah pembayaran atau pencatatan transaksi seperti QR gagal, double payment, atau transaksi tidak tercatat.',
            action: () => alert('Fitur dalam pengembangan')
        }
    ];

    return (
        <Layout showBottomNav={false}>
            <Header title="Komplain" />

            <div className="p-4 pb-20 bg-neutral-50 min-h-screen">
                <div className="mb-6">
                    <p className="text-sm text-neutral-600 leading-relaxed">
                        Pilih kategori masalah yang Anda alami saat bertransaksi atau menggunakan layanan di SPBU.
                    </p>
                </div>

                <div className="space-y-3">
                    {complaintCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={cat.action}
                            className="w-full bg-white rounded-xl border border-neutral-200 p-4 hover:border-[#1B4E9B] hover:shadow-md transition-all text-left flex items-start gap-4 active:scale-[0.99] group"
                        >
                            <div className={`p-3 rounded-xl ${cat.bg} shrink-0`}>
                                {cat.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-neutral-900 mb-1 group-hover:text-[#1B4E9B] transition-colors">{cat.title}</h3>
                                <p className="text-xs text-neutral-500 leading-relaxed">{cat.desc}</p>
                            </div>
                            <ChevronRight size={20} className="text-neutral-300 mt-2 shrink-0 group-hover:text-[#1B4E9B] group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default KomplainSPBU;
