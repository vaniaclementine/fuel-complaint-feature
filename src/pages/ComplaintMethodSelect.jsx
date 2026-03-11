import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTransactions } from '@/context/TransactionContext';
import {
    CheckSquare, Square, Receipt, Plus, X, Fuel,
    AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Upload,
    ShieldCheck, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FUEL_TYPES } from '@/lib/constants';

const MINIMUM_CLAIM_VALUE = 100_000;

let manualCounter = 1;
const generateManualId = () => `MANUAL-${String(manualCounter++).padStart(3, '0')}`;

const FUEL_COLOR = {
    pertamax_green: 'text-emerald-600',
    pertamax: 'text-blue-600',
    pertamax_turbo: 'text-purple-600',
    pertalite: 'text-green-600',
    dex: 'text-amber-600',
    dexlite: 'text-orange-600',
};

const ComplaintMethodSelect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getEligibleTransactions, formatDate } = useTransactions();

    const eligibleTransactions = getEligibleTransactions();
    const preselectedId = location.state?.transactionId;

    // Multi-select state for digital transactions
    const [selectedIds, setSelectedIds] = useState(
        preselectedId ? new Set([preselectedId]) : new Set()
    );

    // Manual receipts state
    const [manualReceipts, setManualReceipts] = useState([]);
    const [showAddManual, setShowAddManual] = useState(false);
    const [manualForm, setManualForm] = useState({
        spbu: '', date: '', fuelType: '', amount: '', file: null
    });
    const [manualErrors, setManualErrors] = useState({});
    const fileInputRef = useRef(null);

    // Toggle a digital transaction
    const toggleTransaction = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Compute totals
    const selectedDigital = eligibleTransactions.filter(t => selectedIds.has(t.id));
    const digitalTotal = selectedDigital.reduce((sum, t) => sum + t.amount, 0);
    const manualTotal = manualReceipts.reduce((sum, r) => sum + r.amount, 0);
    const grandTotal = digitalTotal + manualTotal;
    const progress = Math.min(100, (grandTotal / MINIMUM_CLAIM_VALUE) * 100);
    const isEligible = grandTotal >= MINIMUM_CLAIM_VALUE;
    const shortfall = MINIMUM_CLAIM_VALUE - grandTotal;

    // Manual form validation & add
    const validateManual = () => {
        const e = {};
        if (!manualForm.spbu.trim()) e.spbu = 'Nama SPBU wajib diisi';
        if (!manualForm.date) e.date = 'Tanggal wajib diisi';
        if (!manualForm.fuelType) e.fuelType = 'Pilih jenis BBM';
        if (!manualForm.amount || parseInt(manualForm.amount) <= 0) e.amount = 'Nilai wajib diisi';
        setManualErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleAddManual = () => {
        if (!validateManual()) return;
        const fuelLabel = FUEL_TYPES.find(f => f.value === manualForm.fuelType)?.label || manualForm.fuelType;
        const newReceipt = {
            id: generateManualId(),
            spbu: manualForm.spbu,
            date: manualForm.date,
            fuelType: manualForm.fuelType,
            fuelLabel,
            amount: parseInt(manualForm.amount),
            fileName: manualForm.file?.name || null,
            source: 'manual',
        };
        setManualReceipts(prev => [...prev, newReceipt]);
        setManualForm({ spbu: '', date: '', fuelType: '', amount: '', file: null });
        setManualErrors({});
        setShowAddManual(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeManual = (id) => {
        setManualReceipts(prev => prev.filter(r => r.id !== id));
    };

    const handleContinue = () => {
        if (!isEligible) return;

        const selectedTransactions = [
            ...selectedDigital.map(t => ({
                id: t.id,
                spbu: t.location,
                fuelType: t.fuelType,
                fuelLabel: t.product,
                date: t.date,
                amount: t.amount,
                source: 'digital',
            })),
            ...manualReceipts,
        ];

        navigate('/komplain-bbm/form', {
            state: {
                method: selectedDigital.length > 0 && manualReceipts.length === 0 ? 'digital' : 'mixed',
                selectedTransactions,
                transactionId: selectedDigital[0]?.id || manualReceipts[0]?.id,
                grandTotal,
            }
        });
    };

    return (
        <Layout showBottomNav={false}>
            <Header title="Pilih Transaksi" />

            <div className="p-4 space-y-5 pb-48">
                {/* Hero instruction */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
                    <p className="font-semibold mb-1">Ajukan Komplain BBM</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Pilih transaksi yang ingin dikomplain atau tambahkan struk manual.
                        Total nilai transaksi harus mencapai <span className="font-bold">Rp {MINIMUM_CLAIM_VALUE.toLocaleString('id-ID')}</span> untuk melanjutkan.
                    </p>
                </div>

                {/* ── DIGITAL TRANSACTIONS ── */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-neutral-900">Riwayat Transaksi BBM</h3>
                        <span className="text-xs text-neutral-500">90 hari terakhir</span>
                    </div>

                    {eligibleTransactions.length === 0 ? (
                        <Card className="text-center py-8 text-neutral-400">
                            <Fuel size={28} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Tidak ada transaksi BBM dalam 90 hari terakhir</p>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {eligibleTransactions.map(txn => {
                                const selected = selectedIds.has(txn.id);
                                return (
                                    <motion.button
                                        key={txn.id}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => toggleTransaction(txn.id)}
                                        className={`w-full text-left rounded-xl border-2 p-3.5 transition-all flex items-center gap-3 ${selected
                                            ? 'border-[#1B4E9B] bg-blue-50 shadow-sm'
                                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                                            }`}
                                    >
                                        {/* Checkbox */}
                                        <div className="flex-shrink-0">
                                            {selected
                                                ? <CheckSquare size={22} className="text-[#1B4E9B]" />
                                                : <Square size={22} className="text-neutral-300" />
                                            }
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-neutral-900 truncate">{txn.product}</p>
                                                <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0">
                                                    ✓ Verifikasi otomatis
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-0.5">{txn.location} • {formatDate(txn.date)}</p>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right flex-shrink-0">
                                            <p className={`text-sm font-bold ${selected ? 'text-[#1B4E9B]' : 'text-neutral-900'}`}>
                                                Rp {txn.amount.toLocaleString('id-ID')}
                                            </p>
                                            {txn.liters && (
                                                <p className="text-xs text-neutral-500">{txn.liters.toFixed(2)} Ltr</p>
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── MANUAL RECEIPTS ── */}
                <div>
                    <h3 className="text-sm font-bold text-neutral-900 mb-3">Struk Manual</h3>

                    {/* Existing manual receipts */}
                    <AnimatePresence>
                        {manualReceipts.map(receipt => (
                            <motion.div
                                key={receipt.id}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-2"
                            >
                                <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-3.5 flex items-center gap-3">
                                    <Receipt size={20} className="text-amber-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-neutral-900">Struk Manual</p>
                                            <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0">
                                                Perlu verifikasi tambahan
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {receipt.spbu} • {receipt.fuelLabel}
                                        </p>
                                        {receipt.fileName && (
                                            <p className="text-[10px] text-neutral-400 mt-0.5 truncate">📎 {receipt.fileName}</p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                                        <p className="text-sm font-bold text-amber-700">
                                            Rp {receipt.amount.toLocaleString('id-ID')}
                                        </p>
                                        <button onClick={() => removeManual(receipt.id)} className="text-neutral-300 hover:text-red-400 transition-colors p-1">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Add manual receipt toggle */}
                    <button
                        onClick={() => setShowAddManual(v => !v)}
                        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all text-sm font-semibold ${showAddManual
                            ? 'border-amber-300 bg-amber-50 text-amber-700'
                            : 'border-neutral-200 text-neutral-500 hover:border-amber-300 hover:text-amber-600'
                            }`}
                    >
                        {showAddManual ? <ChevronUp size={16} /> : <Plus size={16} />}
                        {showAddManual ? 'Tutup Form' : 'Tambahkan Struk Manual'}
                    </button>

                    {/* Inline manual receipt form */}
                    <AnimatePresence>
                        {showAddManual && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Detail Struk Manual</p>

                                    {/* Photo upload */}
                                    <div>
                                        <label className="text-xs font-medium text-neutral-700 block mb-1">
                                            Foto Struk <span className="text-neutral-400">(opsional)</span>
                                        </label>
                                        <div
                                            className="border-2 border-dashed border-amber-300 rounded-lg p-3 text-center cursor-pointer hover:bg-amber-100 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,.pdf"
                                                className="hidden"
                                                onChange={e => setManualForm(f => ({ ...f, file: e.target.files?.[0] || null }))}
                                            />
                                            {manualForm.file ? (
                                                <p className="text-xs text-amber-800 flex items-center justify-center gap-1">
                                                    <CheckCircle2 size={14} className="text-green-600" />
                                                    {manualForm.file.name}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-amber-600 flex items-center justify-center gap-1">
                                                    <Upload size={14} /> Klik untuk upload foto struk
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* SPBU */}
                                    <div>
                                        <label className="text-xs font-medium text-neutral-700 block mb-1">Nama SPBU <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: SPBU 31.123.99"
                                            className={`w-full p-2.5 text-sm rounded-lg border ${manualErrors.spbu ? 'border-red-300' : 'border-amber-200'} bg-white focus:ring-2 focus:ring-amber-300 outline-none`}
                                            value={manualForm.spbu}
                                            onChange={e => setManualForm(f => ({ ...f, spbu: e.target.value }))}
                                        />
                                        {manualErrors.spbu && <p className="text-[11px] text-red-500 mt-0.5">{manualErrors.spbu}</p>}
                                    </div>

                                    {/* Date + Fuel type side by side */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs font-medium text-neutral-700 block mb-1">Tanggal <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                className={`w-full p-2.5 text-sm rounded-lg border ${manualErrors.date ? 'border-red-300' : 'border-amber-200'} bg-white focus:ring-2 focus:ring-amber-300 outline-none`}
                                                value={manualForm.date}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={e => setManualForm(f => ({ ...f, date: e.target.value }))}
                                            />
                                            {manualErrors.date && <p className="text-[11px] text-red-500 mt-0.5">{manualErrors.date}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-neutral-700 block mb-1">Jenis BBM <span className="text-red-500">*</span></label>
                                            <select
                                                className={`w-full p-2.5 text-sm rounded-lg border ${manualErrors.fuelType ? 'border-red-300' : 'border-amber-200'} bg-white focus:ring-2 focus:ring-amber-300 outline-none`}
                                                value={manualForm.fuelType}
                                                onChange={e => setManualForm(f => ({ ...f, fuelType: e.target.value }))}
                                            >
                                                <option value="">Pilih...</option>
                                                {FUEL_TYPES.map(ft => (
                                                    <option key={ft.value} value={ft.value}>{ft.label}</option>
                                                ))}
                                            </select>
                                            {manualErrors.fuelType && <p className="text-[11px] text-red-500 mt-0.5">{manualErrors.fuelType}</p>}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="text-xs font-medium text-neutral-700 block mb-1">Estimasi Nilai (Rp) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Contoh: 60000"
                                            min="1"
                                            className={`w-full p-2.5 text-sm rounded-lg border ${manualErrors.amount ? 'border-red-300' : 'border-amber-200'} bg-white focus:ring-2 focus:ring-amber-300 outline-none`}
                                            value={manualForm.amount}
                                            onChange={e => setManualForm(f => ({ ...f, amount: e.target.value }))}
                                        />
                                        {manualErrors.amount && <p className="text-[11px] text-red-500 mt-0.5">{manualErrors.amount}</p>}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="default"
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm"
                                        onClick={handleAddManual}
                                    >
                                        + Tambahkan ke Daftar
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── STICKY BOTTOM: Total + Progress + Button ── */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-neutral-100 z-20 shadow-2xl">
                <div className="p-4 space-y-3">
                    {/* Total + Minimum */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-neutral-500">Total Nilai Transaksi Dipilih</p>
                            <p className={`text-xl font-extrabold ${isEligible ? 'text-green-600' : 'text-neutral-900'}`}>
                                Rp {grandTotal.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-neutral-400">Minimum pengajuan</p>
                            <p className="text-sm font-bold text-neutral-600">
                                Rp {MINIMUM_CLAIM_VALUE.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full transition-colors ${isEligible ? 'bg-green-500' : 'bg-[#1B4E9B]'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <p className="text-[10px] text-neutral-400">
                                {selectedIds.size + manualReceipts.length} item dipilih
                            </p>
                            {isEligible ? (
                                <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                                    <CheckCircle2 size={10} /> Memenuhi syarat
                                </p>
                            ) : (
                                <p className="text-[10px] text-neutral-500">
                                    Kurang Rp {shortfall.toLocaleString('id-ID')} lagi
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Warning or eligible badge */}
                    {!isEligible && (selectedIds.size + manualReceipts.length) > 0 && (
                        <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 flex items-start gap-2 text-xs text-orange-800">
                            <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                            <span>Total transaksi belum memenuhi minimum pengajuan komplain. Tambahkan transaksi atau unggah struk tambahan.</span>
                        </div>
                    )}

                    {/* Lanjutkan button */}
                    <Button
                        variant="default"
                        className={`w-full font-bold text-sm transition-all ${isEligible
                            ? 'bg-[#1B4E9B] hover:bg-[#1B4E9B]/90 text-white shadow-md'
                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            }`}
                        disabled={!isEligible}
                        onClick={handleContinue}
                    >
                        {isEligible
                            ? `Lanjutkan →`
                            : `Lanjutkan (min. Rp ${MINIMUM_CLAIM_VALUE.toLocaleString('id-ID')})`
                        }
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default ComplaintMethodSelect;
