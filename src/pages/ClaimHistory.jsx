import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import FilterPill from '@/components/ui/FilterPill';
import BottomNav from '@/components/ui/BottomNav';
import { useClaims } from '@/context/ClaimContext';
import { ChevronRight, Calendar, MapPin, FileText, Receipt, ClipboardList, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

const ClaimHistory = () => {
    const navigate = useNavigate();
    const { claims } = useClaims();
    const [statusFilter, setStatusFilter] = useState('all');

    const statusFilters = [
        { id: 'all', label: 'Semua' },
        { id: 'process', label: 'Diproses' },
        { id: 'done', label: 'Diterima' },
        { id: 'rejected', label: 'Ditolak' },
    ];

    const IN_PROGRESS_STATUSES = new Set(['received', 'verifying', 'process', 'investigation']);

    const filteredClaims = statusFilter === 'all'
        ? claims
        : statusFilter === 'process'
            ? claims.filter(c => IN_PROGRESS_STATUSES.has(c.status))
            : claims.filter(c => c.status === statusFilter);

    const handleClaimClick = (claimId) => {
        navigate(`/komplain-bbm/${claimId}`);
    };

    return (
        <>
            <Layout showBottomNav={true}>
                <Header title="Riwayat Komplain Saya" />

                <div className="p-4 space-y-4">
                    {/* Status Filter Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {statusFilters.map((filter) => (
                            <FilterPill
                                key={filter.id}
                                active={statusFilter === filter.id}
                                onClick={() => setStatusFilter(filter.id)}
                            >
                                {filter.label}
                            </FilterPill>
                        ))}
                    </div>

                    {/* Claims List */}
                    {filteredClaims.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
                                <FileText className="text-neutral-400" size={28} />
                            </div>
                            <p className="text-neutral-400 text-sm">
                                {statusFilter === 'all'
                                    ? 'Belum ada riwayat komplain.'
                                    : `Tidak ada komplain dengan status "${statusFilters.find(f => f.id === statusFilter)?.label}".`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredClaims.map((claim, index) => (
                                <motion.div
                                    key={claim.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        className="hover:border-[#1B4E9B] hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => handleClaimClick(claim.id)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded font-mono">
                                                {claim.id}
                                            </span>
                                            <StatusBadge status={claim.status} />
                                        </div>

                                        {/* Issue type */}
                                        <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                                            {claim.issueType || 'Komplain BBM'}
                                        </h3>

                                        <div className="flex flex-col gap-1.5 text-xs text-neutral-500">
                                            {claim.submittedDate && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={13} />
                                                    <span>Diajukan: {new Date(claim.submittedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            )}
                                            {claim.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={13} />
                                                    <span>{claim.location}</span>
                                                </div>
                                            )}
                                            {claim.transactionId && (
                                                <div className="flex items-center gap-2">
                                                    <Hash size={13} />
                                                    <span className="font-mono">{claim.transactionId}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-between items-center">
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${claim.submissionMethod === 'manual' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-[#1B4E9B]'}`}>
                                                {claim.submissionMethod === 'manual' ? '📄 Struk Manual' : '📱 Digital'}
                                            </span>
                                            <div className="text-[#1B4E9B] text-xs font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                Lihat Detail <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </Layout>
            <BottomNav />
        </>
    );
};

export default ClaimHistory;
