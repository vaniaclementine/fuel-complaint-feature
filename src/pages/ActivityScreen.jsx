import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Card from '@/components/ui/Card';
import FilterPill from '@/components/ui/FilterPill';
import BottomNav from '@/components/ui/BottomNav';
import { useTransactions } from '@/context/TransactionContext';
import { Fuel, Zap, Flame, ChevronRight } from 'lucide-react';
import { PRODUCT_FILTERS } from '@/lib/constants';

const FUEL_ICON_MAP = {
    pertamax_green: { bg: 'bg-emerald-100', color: 'text-emerald-600' },
    pertamax: { bg: 'bg-blue-100', color: 'text-blue-600' },
    pertamax_turbo: { bg: 'bg-purple-100', color: 'text-purple-600' },
    pertalite: { bg: 'bg-green-100', color: 'text-green-600' },
    dex: { bg: 'bg-amber-100', color: 'text-amber-600' },
    dexlite: { bg: 'bg-orange-100', color: 'text-orange-600' },
    default: { bg: 'bg-neutral-100', color: 'text-neutral-500' },
};

const ActivityScreen = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pembelian');
    const { activeFilter, setActiveFilter, getFilteredTransactions, formatDate } = useTransactions();

    const filteredTransactions = getFilteredTransactions();

    const getIcon = (txn) => {
        if (txn.type === 'e-voucher') return <Zap className="text-amber-500" size={20} />;
        if (txn.type === 'lpg') return <Flame className="text-orange-500" size={20} />;
        return <Fuel className={FUEL_ICON_MAP[txn.fuelType]?.color || 'text-neutral-500'} size={20} />;
    };

    const getBg = (txn) => {
        if (txn.type === 'e-voucher') return 'bg-amber-50';
        return FUEL_ICON_MAP[txn.fuelType]?.bg || 'bg-neutral-100';
    };

    return (
        <>
            <Layout className="bg-white">
                {/* Header with Tabs */}
                <div className="p-4 bg-white sticky top-0 z-10 border-b border-neutral-100">
                    <h1 className="text-2xl font-bold mb-4">Aktivitas</h1>
                    <div className="flex gap-6 border-b-2 border-neutral-100">
                        <button
                            onClick={() => setActiveTab('pembelian')}
                            className={`pb-3 text-sm font-medium transition-all relative ${activeTab === 'pembelian' ? 'text-neutral-900' : 'text-neutral-400'}`}
                        >
                            Pembelian Produk
                            {activeTab === 'pembelian' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4E9B]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('delivery')}
                            className={`pb-3 text-sm font-medium transition-all relative ${activeTab === 'delivery' ? 'text-neutral-900' : 'text-neutral-400'}`}
                        >
                            Delivery Service
                            {activeTab === 'delivery' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4E9B]" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {activeTab === 'pembelian' ? (
                        <>
                            {/* Filter Pills */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <FilterPill active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
                                    Semua
                                </FilterPill>
                                {PRODUCT_FILTERS.map((filter) => (
                                    <FilterPill
                                        key={filter.id}
                                        active={activeFilter === filter.id}
                                        onClick={() => setActiveFilter(filter.id)}
                                    >
                                        {filter.label}
                                    </FilterPill>
                                ))}
                            </div>

                            <p className="text-sm text-neutral-500 font-medium pt-2">
                                Transaksi 30 hari terakhir
                            </p>

                            {/* Transaction List — each card is tappable */}
                            <div className="space-y-3">
                                {filteredTransactions.map((transaction) => (
                                    <button
                                        key={transaction.id}
                                        onClick={() => navigate(`/aktivitas/transaksi/${transaction.id}`)}
                                        className="w-full text-left"
                                    >
                                        <Card className="flex items-center gap-3 hover:shadow-md transition-shadow active:scale-[0.99]">
                                            <div className={`${getBg(transaction)} p-2 rounded-lg h-fit flex-shrink-0`}>
                                                {getIcon(transaction)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-neutral-900 text-sm truncate">
                                                    {transaction.product}
                                                </h3>
                                                <p className="text-xs text-neutral-500 mt-0.5 truncate">
                                                    {transaction.location} • {formatDate(transaction.date)}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0 flex items-center gap-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900">
                                                        Rp {transaction.amount.toLocaleString('id-ID')}
                                                    </p>
                                                    {transaction.liters && (
                                                        <p className="text-xs text-neutral-500 mt-0.5">
                                                            {transaction.liters.toFixed(2)} Ltr
                                                        </p>
                                                    )}
                                                </div>
                                                <ChevronRight size={16} className="text-neutral-300" />
                                            </div>
                                        </Card>
                                    </button>
                                ))}

                                {filteredTransactions.length === 0 && (
                                    <div className="text-center py-10 text-neutral-400">
                                        <p>Tidak ada transaksi untuk kategori ini.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 text-neutral-400">
                            <p>Belum ada transaksi Delivery Service.</p>
                        </div>
                    )}
                </div>
            </Layout>
            <BottomNav />
        </>
    );
};

export default ActivityScreen;
