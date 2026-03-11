import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ShieldCheck, FileText, ClipboardList, ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COVERAGE_INFO, EXAMPLE_CASES, SLA } from '@/lib/constants';

const ClaimLanding = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedSection, setExpandedSection] = useState(null);
    const locationState = location.state || {};
    const { transactionId, spbu, date, liters, address } = locationState;

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <Layout showBottomNav={false}>
            <Header title="Komplain BBM" />

            <div className="p-4 flex flex-col gap-6 pb-8">
                {/* Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gradient-to-br from-[#1B4E9B] to-[#0d3272] rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                        <ShieldCheck size={48} className="mx-auto mb-4 text-white/90" />
                        <h2 className="text-lg font-bold mb-2">Jaminan Layanan BBM</h2>
                        <p className="text-sm text-white/90 leading-relaxed">
                            Kami menjamin kualitas BBM di jaringan SPBU Pertamina.
                            Jika mengalami kendala kendaraan setelah pengisian, ajukan komplain melalui fitur ini.
                        </p>
                    </div>
                </motion.div>

                {/* Information Sections */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-neutral-900">Informasi Pengaduan</h3>

                    {/* Coverage */}
                    <Card className="p-0 overflow-hidden">
                        <button
                            onClick={() => toggleSection('coverage')}
                            className="w-full p-4 flex justify-between items-center hover:bg-neutral-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <ShieldCheck className="text-[#1B4E9B]" size={20} />
                                </div>
                                <span className="font-semibold text-neutral-900 text-sm">{COVERAGE_INFO.title}</span>
                            </div>
                            {expandedSection === 'coverage' ? (
                                <ChevronUp className="text-neutral-400" size={20} />
                            ) : (
                                <ChevronDown className="text-neutral-400" size={20} />
                            )}
                        </button>
                        <AnimatePresence>
                            {expandedSection === 'coverage' && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-2 border-t border-neutral-100">
                                        <ul className="space-y-2">
                                            {COVERAGE_INFO.items.map((item, index) => (
                                                <li key={index} className="flex gap-2 text-sm text-neutral-700">
                                                    <CheckCircle className="text-[#1B4E9B] flex-shrink-0 mt-0.5" size={16} />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>

                    {/* SLA */}
                    <Card className="p-0 overflow-hidden">
                        <button
                            onClick={() => toggleSection('sla')}
                            className="w-full p-4 flex justify-between items-center hover:bg-neutral-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <Clock className="text-orange-600" size={20} />
                                </div>
                                <span className="font-semibold text-neutral-900 text-sm">Estimasi SLA</span>
                            </div>
                            {expandedSection === 'sla' ? (
                                <ChevronUp className="text-neutral-400" size={20} />
                            ) : (
                                <ChevronDown className="text-neutral-400" size={20} />
                            )}
                        </button>
                        <AnimatePresence>
                            {expandedSection === 'sla' && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-2 border-t border-neutral-100 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-[#1B4E9B] flex-shrink-0">1</div>
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900">Investigasi</p>
                                                <p className="text-xs text-neutral-500">{SLA.INVESTIGATION}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-[#1B4E9B] flex-shrink-0">2</div>
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-900">Keputusan & Kompensasi</p>
                                                <p className="text-xs text-neutral-500">Setelah investigasi selesai</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-neutral-400 italic">
                                            *Waktu proses dapat bervariasi tergantung kompleksitas kasus
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>

                    {/* Example Cases */}
                    <Card className="p-0 overflow-hidden">
                        <button
                            onClick={() => toggleSection('examples')}
                            className="w-full p-4 flex justify-between items-center hover:bg-neutral-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <FileText className="text-green-600" size={20} />
                                </div>
                                <span className="font-semibold text-neutral-900 text-sm">Contoh Kasus</span>
                            </div>
                            {expandedSection === 'examples' ? (
                                <ChevronUp className="text-neutral-400" size={20} />
                            ) : (
                                <ChevronDown className="text-neutral-400" size={20} />
                            )}
                        </button>
                        <AnimatePresence>
                            {expandedSection === 'examples' && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-2 border-t border-neutral-100 space-y-3">
                                        {EXAMPLE_CASES.map((example, index) => (
                                            <div key={index} className="bg-neutral-50 p-3 rounded-lg">
                                                <h4 className="font-semibold text-sm text-neutral-900 mb-1">
                                                    {example.title}
                                                </h4>
                                                <p className="text-xs text-neutral-600">
                                                    {example.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/komplain-bbm/pilih-metode', {
                            state: { transactionId, spbu, date, liters, address },
                        })}
                        className="w-full"
                    >
                        <div className="bg-[#1B4E9B] hover:bg-[#1B4E9B]/90 text-white p-4 rounded-xl shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-full">
                                    <FileText className="text-white" size={24} />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="font-bold text-white">Ajukan Komplain</h3>
                                    <p className="text-xs text-white/90">Isi formulir & upload dokumen</p>
                                </div>
                            </div>
                        </div>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/komplain-bbm/riwayat')}
                        className="w-full"
                    >
                        <Card className="flex items-center gap-4 hover:border-[#1B4E9B] hover:shadow-md transition-all">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                                <ClipboardList size={24} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="font-semibold text-neutral-900">Status Komplain</h3>
                                <p className="text-xs text-neutral-500">Pantau proses pengajuan Anda</p>
                            </div>
                        </Card>
                    </motion.button>
                </div>
            </div>
        </Layout>
    );
};

export default ClaimLanding;
