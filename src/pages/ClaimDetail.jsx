import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { useClaims } from '@/context/ClaimContext';
import { useNotifications } from '@/context/NotificationContext';
import { startInvestigationFlow, startRebuttalFlow } from '@/lib/useInvestigationFlow';
import { Calendar, MapPin, FileText, AlertCircle, MessageSquare, Hash, Fuel, CheckCircle2, Circle, Receipt, ClipboardList, BadgeCheck, FlaskConical, Info } from 'lucide-react';
import { SLA } from '@/lib/constants';
import { motion } from 'framer-motion';

const ClaimDetail = () => {
    const { claimId } = useParams();
    const navigate = useNavigate();
    const { claims, updateClaimStatus } = useClaims();
    const { addNotification } = useNotifications();
    const [simLoading, setSimLoading] = useState(null); // 'approved' | 'rejected' | null
    const [simRebuttalLoading, setSimRebuttalLoading] = useState(null); // 'accepted' | 'rejected' | null

    const claim = claims.find(c => c.id === claimId);

    if (!claim) {
        return (
            <Layout showBottomNav={false}>
                <Header title="Detail Komplain" />
                <div className="p-4 text-center py-16">
                    <AlertCircle className="text-neutral-400 mx-auto mb-3" size={48} />
                    <p className="text-neutral-500">Komplain tidak ditemukan.</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/komplain-bbm/riwayat')}>
                        Kembali ke Riwayat
                    </Button>
                </div>
            </Layout>
        );
    }

    const isRejected = claim.status === 'rejected';
    const isApproved = claim.status === 'done' || claim.status === 'rebuttal_accepted';
    const isRebuttalAccepted = claim.status === 'rebuttal_accepted';
    const isRebuttalRejected = claim.status === 'rebuttal_rejected';
    const canSubmitRebuttal = isRejected && !claim.rebuttalSubmitted;
    const isFinalState = ['done', 'rejected', 'rebuttal_accepted', 'rebuttal_rejected'].includes(claim.status);
    const showEstimate = ['verifying', 'process', 'investigation', 'rebuttal_investigation'].includes(claim.status);

    const handleSimulate = (outcome) => {
        setSimLoading(outcome);
        startInvestigationFlow(claimId, updateClaimStatus, addNotification, outcome);
        setTimeout(() => setSimLoading(null), 1500);
    };

    const handleSimulateRebuttal = (outcome) => {
        setSimRebuttalLoading(outcome);
        startRebuttalFlow(claimId, updateClaimStatus, addNotification, outcome);
        setTimeout(() => setSimRebuttalLoading(null), 1500);
    };

    const rejectionTimestamp = claim.rejectedAt || claim.decisionAt || claim.updatedAt;
    let withinRebuttalWindow = false;
    let daysRemaining = 0;

    if (rejectionTimestamp) {
        const rejectedDate = new Date(rejectionTimestamp);
        const now = new Date();
        const daysSinceRejection = (now.getTime() - rejectedDate.getTime()) / (1000 * 60 * 60 * 24);
        withinRebuttalWindow = daysSinceRejection <= SLA.REBUTTAL_WINDOW;
        daysRemaining = Math.max(0, Math.ceil(SLA.REBUTTAL_WINDOW - daysSinceRejection));
    }

    return (
        <Layout showBottomNav={false}>
            <Header title="Detail Komplain" />

            <div className="p-4 space-y-4 pb-28">
                {/* Claim ID & Status */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/30">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Nomor Komplain</p>
                                <p className="text-lg font-bold text-neutral-900 font-mono">{claim.id}</p>
                            </div>
                            <StatusBadge status={claim.status} />
                        </div>

                        <div className="space-y-1.5">
                            {claim.submittedDate && (
                                <div className="flex items-center gap-2 text-xs text-neutral-600">
                                    <Calendar size={13} />
                                    <span>Diajukan: {new Date(claim.submittedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-neutral-600">
                                {claim.submissionMethod === 'manual'
                                    ? <><Receipt size={13} /><span className="text-amber-700 font-semibold">Struk Manual</span></>
                                    : <><ClipboardList size={13} /><span className="text-[#1B4E9B] font-semibold">Transaksi Digital</span></>
                                }
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Approval Notice */}
                {isApproved && (
                    <Card className="bg-green-50 border-green-200">
                        <div className="flex gap-3">
                            <BadgeCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="font-bold text-sm text-green-900 mb-1">Komplain Diterima</p>
                                <p className="text-xs text-green-700 leading-relaxed mb-2">
                                    Investigasi menunjukkan adanya indikasi masalah setelah pengisian BBM di SPBU terkait.
                                    Komplain Anda telah disetujui dan akan diproses sesuai ketentuan.
                                </p>
                                {claim.decisionAt && (
                                    <p className="text-xs text-green-600">
                                        Disetujui: {new Date(claim.decisionAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                                {claim.compensationAmount != null && (
                                    <div className="mt-2 bg-green-100/70 rounded-lg px-3 py-2 inline-block">
                                        <p className="text-xs text-green-600 font-medium">Estimasi Kompensasi</p>
                                        <p className="text-base font-extrabold text-green-800">
                                            Rp {claim.compensationAmount.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Rejection Notice */}
                {isRejected && (
                    <Card className="bg-red-50 border-red-200">
                        <div className="flex gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="font-bold text-sm text-red-900 mb-1">Komplain Ditolak</p>
                                <p className="text-xs text-red-700 leading-relaxed mb-2">
                                    {claim.rejectionReason || 'Bukti yang diajukan tidak memenuhi persyaratan.'}
                                </p>
                                {rejectionTimestamp && (
                                    <p className="text-xs text-red-600 mb-1">
                                        Ditolak: {new Date(rejectionTimestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                                {withinRebuttalWindow && canSubmitRebuttal ? (
                                    <p className="text-xs text-red-600 font-semibold">
                                        ⏰ Waktu sanggahan: {daysRemaining} hari lagi
                                    </p>
                                ) : !canSubmitRebuttal && !claim.rebuttalSubmitted && (
                                    <p className="text-xs text-red-800 font-semibold">❌ Masa sanggahan sudah berakhir.</p>
                                )}
                                {claim.rebuttalSubmitted && (
                                    <p className="text-xs text-green-700 font-semibold">✓ Sanggahan telah diajukan</p>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Sanggahan Diterima card */}
                {isRebuttalAccepted && (
                    <Card className="bg-green-50 border-green-200">
                        <div className="flex gap-3">
                            <BadgeCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="font-bold text-sm text-green-900 mb-1">Sanggahan Diterima</p>
                                <p className="text-xs text-green-700 leading-relaxed mb-2">
                                    Setelah peninjauan ulang, komplain Anda telah disetujui sesuai ketentuan.
                                </p>
                                {claim.decisionAt && (
                                    <p className="text-xs text-green-600">
                                        Disetujui: {new Date(claim.decisionAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                                {claim.compensationAmount != null && (
                                    <div className="mt-2 bg-green-100/70 rounded-lg px-3 py-2 inline-block">
                                        <p className="text-xs text-green-600 font-medium">Estimasi Kompensasi</p>
                                        <p className="text-base font-extrabold text-green-800">
                                            Rp {claim.compensationAmount.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Sanggahan Ditolak card */}
                {isRebuttalRejected && (
                    <Card className="bg-red-50 border-red-200">
                        <div className="flex gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="font-bold text-sm text-red-900 mb-1">Sanggahan Ditolak</p>
                                <p className="text-xs text-red-700 leading-relaxed">
                                    Setelah peninjauan ulang, keputusan penolakan sebelumnya tetap berlaku. Komplain Anda dinyatakan tidak memenuhi persyaratan.
                                </p>
                                {claim.decisionAt && (
                                    <p className="text-xs text-red-600 mt-1">
                                        Ditolak: {new Date(claim.decisionAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Status Timeline */}
                {claim.statusTimeline && claim.statusTimeline.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Status Timeline</h3>
                        <Card className="py-4">
                            <div className="relative pl-6">
                                {claim.statusTimeline.map((step, idx) => {
                                    const isLast = idx === claim.statusTimeline.length - 1;
                                    return (
                                        <div key={idx} className="relative flex gap-4 pb-5 last:pb-0">
                                            {/* Vertical line */}
                                            {!isLast && (
                                                <div className={`absolute left-[-18px] top-5 w-0.5 h-full ${step.done ? 'bg-[#1B4E9B]' : 'bg-neutral-200'}`} />
                                            )}
                                            {/* Icon */}
                                            <div className={`absolute left-[-24px] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-[#1B4E9B]' : 'bg-neutral-200'}`}>
                                                {step.done
                                                    ? <CheckCircle2 size={12} className="text-white" />
                                                    : <Circle size={12} className="text-neutral-400" />
                                                }
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold ${step.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                                    {step.label}
                                                </p>
                                                {step.date && (
                                                    <p className="text-xs text-neutral-500 mt-0.5">
                                                        {new Date(step.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                                {!step.date && !step.done && (
                                                    <p className="text-xs text-neutral-400 mt-0.5">Sedang menunggu...</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Estimated Compensation */}
                {showEstimate && (
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-2">Estimasi Kompensasi</h3>
                        <Card className="bg-amber-50 border-amber-100">
                            <div className="flex items-start gap-3">
                                <Info className="text-amber-600 mt-0.5" size={20} />
                                <div>
                                    <p className="text-lg font-bold text-amber-900">
                                        Rp {(claim.compensationAmount || claim.amount || 0).toLocaleString('id-ID')}
                                    </p>
                                    <p className="text-xs text-amber-800 leading-relaxed mt-1">
                                        Estimasi kompensasi yang mungkin diterima apabila komplain disetujui.<br />
                                        Nominal final akan ditentukan setelah proses investigasi selesai.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Transaction Info */}
                <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">Informasi Transaksi</h3>
                    <Card className="p-0 overflow-hidden divide-y divide-neutral-100">
                        {claim.location && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <MapPin size={15} className="text-neutral-400 flex-shrink-0" />
                                <span className="text-xs text-neutral-500 w-24">SPBU</span>
                                <span className="text-xs font-medium text-neutral-900 flex-1 text-right">{claim.location}</span>
                            </div>
                        )}
                        {claim.product && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <Fuel size={15} className="text-neutral-400 flex-shrink-0" />
                                <span className="text-xs text-neutral-500 w-24">Jenis BBM</span>
                                <span className="text-xs font-medium text-neutral-900 flex-1 text-right">{claim.product}</span>
                            </div>
                        )}
                        {claim.amount != null && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <span className="text-neutral-400 text-xs flex-shrink-0 w-4">Rp</span>
                                <span className="text-xs text-neutral-500 w-24">Nilai</span>
                                <span className="text-xs font-medium text-neutral-900 flex-1 text-right">Rp {claim.amount.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                        {claim.transactionId && (
                            <div className="flex items-center gap-3 px-4 py-3">
                                <Hash size={15} className="text-neutral-400 flex-shrink-0" />
                                <span className="text-xs text-neutral-500 w-24">ID Transaksi</span>
                                <span className="text-xs font-mono font-medium text-neutral-900 flex-1 text-right">{claim.transactionId}</span>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Complaint Details */}
                <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">Detail Komplain</h3>
                    <Card>
                        {claim.issueType && (
                            <div className="mb-3">
                                <span className="inline-block bg-blue-50 text-[#1B4E9B] text-xs px-2.5 py-1 rounded-full font-semibold">
                                    {claim.issueType}
                                </span>
                            </div>
                        )}
                        <p className="text-sm text-neutral-700 leading-relaxed">{claim.description}</p>
                    </Card>
                </div>

                {/* Uploaded Evidence */}
                {claim.files && claim.files.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 mb-2">Bukti yang Diunggah</h3>
                        <Card>
                            <div className="space-y-2">
                                {claim.files.map((file, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                                        <FileText className="text-[#1B4E9B] flex-shrink-0" size={18} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate">{file.name}</p>
                                            <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* DEV — Rebuttal Simulation Panel */}
            {claim.rebuttalSubmitted && !['rebuttal_accepted', 'rebuttal_rejected'].includes(claim.status) && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white border-t border-neutral-100 z-20 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        <FlaskConical size={12} />
                        Simulasi Hasil Sanggahan
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSimulateRebuttal('rejected')}
                            disabled={!!simRebuttalLoading}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                            {simRebuttalLoading === 'rejected' ? 'Memproses...' : '❌ Sanggahan Ditolak'}
                        </button>
                        <button
                            onClick={() => handleSimulateRebuttal('accepted')}
                            disabled={!!simRebuttalLoading}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
                        >
                            {simRebuttalLoading === 'accepted' ? 'Memproses...' : '✅ Sanggahan Diterima'}
                        </button>
                    </div>
                </div>
            )}

            {/* DEV — Simulation Panel */}
            {!isFinalState && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white border-t border-neutral-100 z-20 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        <FlaskConical size={12} />
                        Simulasi Keputusan
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSimulate('rejected')}
                            disabled={!!simLoading}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                            {simLoading === 'rejected' ? 'Memproses...' : '❌ Komplain Ditolak'}
                        </button>
                        <button
                            onClick={() => handleSimulate('approved')}
                            disabled={!!simLoading}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
                        >
                            {simLoading === 'approved' ? 'Memproses...' : '✅ Komplain Disetujui'}
                        </button>
                    </div>
                </div>
            )}

            {/* Sanggahan CTA */}
            {isRejected && canSubmitRebuttal && withinRebuttalWindow && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white border-t border-neutral-100 z-20">
                    <Button
                        variant="default"
                        className="w-full font-bold text-white bg-[#1B4E9B] hover:bg-[#1B4E9B]/90 flex items-center justify-center gap-2"
                        onClick={() => navigate(`/komplain-bbm/${claimId}/sanggahan`)}
                    >
                        <MessageSquare size={18} />
                        Ajukan Sanggahan
                    </Button>
                    <p className="text-xs text-neutral-500 text-center mt-2">
                        Sanggahan dapat diajukan maksimal 3 hari setelah komplain ditolak
                    </p>
                </div>
            )}
        </Layout>
    );
};

export default ClaimDetail;
