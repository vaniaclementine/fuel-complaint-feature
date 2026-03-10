import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTransactions } from '@/context/TransactionContext';
import { Fuel, MapPin, Calendar, Hash, Droplets, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FUEL_COLOR_MAP = {
    pertamax_green: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' },
    pertamax: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' },
    pertamax_turbo: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' },
    pertalite: { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' },
    dex: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' },
    dexlite: { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-600' },
    default: { bg: 'bg-neutral-100', text: 'text-neutral-700', icon: 'text-neutral-600' },
};

const TransactionDetail = () => {
    const navigate = useNavigate();
    const { transactionId } = useParams();
    const { getTransaction, isFuelTransaction, formatDate } = useTransactions();

    const txn = getTransaction(transactionId);
    const colors = FUEL_COLOR_MAP[txn?.fuelType] || FUEL_COLOR_MAP.default;

    if (!txn) {
        return (
            <Layout showBottomNav={false}>
                <Header title="Detail Transaksi" />
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                    <AlertTriangle size={40} />
                    <p className="mt-3">Transaksi tidak ditemukan</p>
                </div>
            </Layout>
        );
    }

    const handleKomplain = () => {
        navigate('/komplain-bbm', {
            state: {
                transactionId: txn.id,
                spbu: txn.location,
                date: txn.date,
                liters: txn.liters,
                address: txn.address,
            },
        });
    };

    const infoRows = [
        {
            icon: <MapPin size={16} className="text-neutral-400" />,
            label: 'SPBU',
            value: txn.location,
        },
        {
            icon: <Calendar size={16} className="text-neutral-400" />,
            label: 'Tanggal',
            value: formatDate(txn.date),
        },
        {
            icon: <Hash size={16} className="text-neutral-400" />,
            label: 'ID Transaksi',
            value: txn.id,
        },
        {
            icon: <Droplets size={16} className="text-neutral-400" />,
            label: 'Jumlah',
            value: txn.liters ? `${txn.liters.toFixed(2)} Liter` : '-',
        },
    ];

    return (
        <Layout showBottomNav={false}>
            <Header title="Detail Transaksi" />

            <div className="p-4 space-y-5 pb-28">
                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className="flex flex-col items-center text-center gap-3 py-6">
                        <div className={`${colors.bg} p-4 rounded-2xl`}>
                            <Fuel className={colors.icon} size={32} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">{txn.product}</h2>
                            <p className={`text-xs font-semibold mt-1 ${colors.text} ${colors.bg} px-3 py-1 rounded-full inline-block`}>
                                BBM
                            </p>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900">
                            Rp {txn.amount.toLocaleString('id-ID')}
                        </p>
                        <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            ✓ Berhasil
                        </span>
                    </Card>
                </motion.div>

                {/* Detail Info */}
                <Card className="p-0 overflow-hidden divide-y divide-neutral-100">
                    {infoRows.map((row, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            {row.icon}
                            <span className="text-sm text-neutral-500 w-28 flex-shrink-0">{row.label}</span>
                            <span className="text-sm font-medium text-neutral-900 flex-1 text-right">{row.value}</span>
                        </div>
                    ))}
                    {txn.address && (
                        <div className="flex items-start gap-3 px-4 py-3">
                            <MapPin size={16} className="text-neutral-400 mt-0.5" />
                            <span className="text-sm text-neutral-500 w-28 flex-shrink-0">Alamat</span>
                            <span className="text-sm font-medium text-neutral-900 flex-1 text-right">{txn.address}</span>
                        </div>
                    )}
                </Card>

                {/* Complaint Section — only for fuel transactions */}
                {isFuelTransaction(txn) && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-100 rounded-xl">
                                    <AlertTriangle className="text-orange-600" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 text-sm">Ada masalah setelah pengisian?</h3>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Laporkan keluhan kualitas BBM Anda. Klaim akan diproses dalam 3–5 hari kerja.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="default"
                                className="w-full bg-[#1B4E9B] hover:bg-[#1B4E9B]/90 text-white font-semibold flex items-center justify-center gap-2"
                                onClick={handleKomplain}
                            >
                                Ajukan Komplain BBM
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default TransactionDetail;
