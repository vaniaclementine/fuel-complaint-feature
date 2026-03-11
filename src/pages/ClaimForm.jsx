import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { useClaims } from '@/context/ClaimContext';
import { useTransactions } from '@/context/TransactionContext';
import { UploadCloud, X, FileImage, FileVideo, FileText, Wrench, AlertCircle, CheckCircle2, Receipt, ClipboardList, Layers } from 'lucide-react';
import { ISSUE_TYPES, FUEL_TYPES, FILE_UPLOAD } from '@/lib/constants';
import { generateManualTxnId } from '@/context/TransactionContext';


const MAX_FILE_SIZE_MB = 10;

/** Reusable upload box for a single evidence category */
const EvidenceUploadBox = ({
    id, icon, label, required, hint, accept, acceptLabel,
    files, error, multiple, onChange, onRemove,
}) => (
    <div className="space-y-2">
        {/* Header row */}
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-semibold text-neutral-800">{label}</span>
            {required
                ? <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Wajib</span>
                : <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-neutral-400 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">Opsional</span>
            }
        </div>

        {/* Drop zone */}
        <label
            htmlFor={id}
            className={`cursor-pointer flex flex-col items-center gap-1.5 border-2 border-dashed rounded-xl p-4 text-center transition-colors
                ${error ? 'border-red-300 bg-red-50' : 'border-neutral-200 hover:border-[#1B4E9B]/40 hover:bg-blue-50/30'}`}
        >
            <input
                id={id}
                type="file"
                accept={accept}
                multiple={!!multiple}
                className="hidden"
                onChange={onChange}
            />
            <UploadCloud size={24} className={error ? 'text-red-400' : 'text-neutral-400'} />
            <span className={`text-xs font-medium ${error ? 'text-red-500' : 'text-[#1B4E9B]'}`}>Klik untuk upload</span>
            <span className="text-[11px] text-neutral-400">{hint}</span>
            <span className="text-[11px] text-neutral-400">{acceptLabel} • Maks {MAX_FILE_SIZE_MB}MB</span>
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* File list */}
        {files && files.length > 0 && (
            <div className="space-y-1.5">
                {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
                        <FileText size={14} className="text-neutral-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-medium text-neutral-900">{file.name}</p>
                            <p className="text-[10px] text-neutral-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={() => onRemove(i)} className="text-neutral-300 hover:text-red-400 p-1 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const ClaimForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addClaim, updateClaimData } = useClaims();
    const { getTransaction, formatDate } = useTransactions();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Submission context from navigation state
    // method: 'digital' | 'manual' | 'mixed'
    const editMode = location.state?.editMode || false;
    const claimData = location.state?.claimData || null;

    const method = location.state?.method || 'digital';
    const prefilledTransactionId = location.state?.transactionId;
    const selectedTransactions = location.state?.selectedTransactions || null; // new multi-select
    const grandTotal = location.state?.grandTotal || null;

    // For legacy single-txn digital flow
    const selectedTransaction = (!selectedTransactions && prefilledTransactionId)
        ? getTransaction(prefilledTransactionId)
        : null;

    // Form state pre-filled for editMode
    const [formData, setFormData] = useState({
        issueType: claimData ? (ISSUE_TYPES.find(t => t.label === claimData.issueType)?.value || claimData.issueType || '') : '',
        description: claimData?.description || '',
        // Manual-only fields (legacy single-manual flow)
        manualSpbu: '',
        manualDate: '',
        manualFuelType: '',
        manualAmount: '',
    });
    // Structured evidence state — one slot per evidence type
    const [evidence, setEvidence] = useState({
        struk: [],        // required
        vehicle: [],      // required
        video: [],        // optional
        workshop: [],     // required
        additional: [],   // optional
    });
    const [errors, setErrors] = useState({});

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    const handleEvidenceChange = (type, e, multiple = false) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        const oversized = newFiles.filter(f => f.size > MAX_SIZE_BYTES);
        if (oversized.length > 0) {
            setErrors(prev => ({ ...prev, [type]: 'File melebihi ukuran maksimal 10MB' }));
            return;
        }
        setEvidence(prev => ({
            ...prev,
            [type]: multiple ? [...prev[type], ...newFiles] : newFiles,
        }));
        setErrors(prev => ({ ...prev, [type]: null }));
    };

    const removeEvidence = (type, index) => {
        setEvidence(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.issueType) newErrors.issueType = 'Pilih jenis kendala';
        if (!formData.description.trim()) newErrors.description = 'Deskripsi tidak boleh kosong';

        // Only enforce file uploads if we are NOT in editMode.
        // In editMode, they already uploaded files. Replacing files won't strictly be required unless they actually clear them.
        if (!editMode) {
            if (evidence.struk.length === 0) newErrors.struk = 'Foto struk / bukti transaksi wajib diupload';
            if (evidence.vehicle.length === 0) newErrors.vehicle = 'Foto kondisi kendaraan wajib diupload';
            if (evidence.workshop.length === 0) newErrors.workshop = 'Nota servis bengkel wajib diupload';
        }

        // Legacy manual-only gate
        if (!editMode && method === 'manual' && !selectedTransactions) {
            if (!formData.manualSpbu.trim()) newErrors.manualSpbu = 'Nama SPBU wajib diisi';
            if (!formData.manualDate) newErrors.manualDate = 'Tanggal transaksi wajib diisi';
            if (!formData.manualFuelType) newErrors.manualFuelType = 'Pilih jenis BBM';
            if (!formData.manualAmount) newErrors.manualAmount = 'Estimasi nilai transaksi wajib diisi';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const issueLabel = ISSUE_TYPES.find(t => t.value === formData.issueType)?.label;

        // If Edit Mode, just update and redirect back to details
        if (editMode && claimData) {
            const newFiles = [
                ...evidence.struk.map(f => ({ name: f.name, size: f.size, category: 'Struk / Bukti Transaksi' })),
                ...evidence.vehicle.map(f => ({ name: f.name, size: f.size, category: 'Foto Kendaraan' })),
                ...evidence.video.map(f => ({ name: f.name, size: f.size, category: 'Video Suara Mesin' })),
                ...evidence.workshop.map(f => ({ name: f.name, size: f.size, category: 'Nota Servis Bengkel' })),
                ...evidence.additional.map(f => ({ name: f.name, size: f.size, category: 'Bukti Tambahan' })),
            ];

            const updatedData = {
                issueType: issueLabel,
                description: formData.description,
            };

            // Only override files if they actually uploaded new ones. Otherwise keep existing.
            if (newFiles.length > 0) {
                updatedData.files = newFiles;
            }

            updateClaimData(claimData.id, updatedData);
            setIsSubmitting(false);
            navigate(`/komplain-bbm/${claimData.id}`);
            return;
        }

        const fuelLabel = FUEL_TYPES.find(f => f.value === formData.manualFuelType)?.label;
        let transactionId, location_str, product, amount;

        if (selectedTransactions && selectedTransactions.length > 0) {
            // Multi-select (mixed/aggregated) flow
            const first = selectedTransactions[0];
            transactionId = selectedTransactions.map(t => t.id).join(', ');
            location_str = first.spbu;
            product = selectedTransactions.map(t => t.fuelLabel || t.product || 'BBM').join(', ');
            amount = grandTotal || selectedTransactions.reduce((s, t) => s + t.amount, 0);
        } else if (method === 'digital' && selectedTransaction) {
            transactionId = selectedTransaction.id;
            location_str = selectedTransaction.location;
            product = selectedTransaction.product;
            amount = selectedTransaction.amount;
        } else {
            transactionId = generateManualTxnId();
            location_str = formData.manualSpbu;
            product = fuelLabel || 'BBM';
            amount = parseInt(formData.manualAmount.replace(/\D/g, ''), 10) || 0;
        }

        const newClaim = {
            id: `CLM-${Math.floor(Math.random() * 9000 + 1000)}`,
            transactionId,
            submissionMethod: selectedTransactions ? 'mixed' : method,
            date: new Date().toISOString().split('T')[0],
            submittedDate: new Date().toISOString(),
            status: 'received',
            issueType: issueLabel,
            description: formData.description,
            location: location_str,
            product,
            amount,
            files: [
                ...evidence.struk.map(f => ({ name: f.name, size: f.size, category: 'Struk / Bukti Transaksi' })),
                ...evidence.vehicle.map(f => ({ name: f.name, size: f.size, category: 'Foto Kendaraan' })),
                ...evidence.video.map(f => ({ name: f.name, size: f.size, category: 'Video Suara Mesin' })),
                ...evidence.workshop.map(f => ({ name: f.name, size: f.size, category: 'Nota Servis Bengkel' })),
                ...evidence.additional.map(f => ({ name: f.name, size: f.size, category: 'Bukti Tambahan' })),
            ],
            selectedTransactions: selectedTransactions || null,
            statusTimeline: [
                { key: 'received', label: 'Pengaduan Diterima', date: new Date().toISOString(), done: true },
                { key: 'verifying', label: 'Sedang Diverifikasi', date: null, done: false },
                { key: 'process', label: 'Sedang Diproses', date: null, done: false },
                { key: 'investigation', label: 'Investigasi SPBU', date: null, done: false },
                { key: 'done', label: 'Keputusan Komplain', date: null, done: false },
            ],
        };

        addClaim(newClaim);
        setIsSubmitting(false);
        navigate('/komplain-bbm/sukses', { state: { claimId: newClaim.id, transactionId } });
    };

    const isMixed = method === 'mixed' || !!selectedTransactions;
    const isManual = method === 'manual' && !selectedTransactions;

    return (
        <Layout showBottomNav={false}>
            <Header title={editMode ? "Edit Komplain BBM" : "Ajukan Komplain BBM"} />

            <form onSubmit={handleSubmit} className="p-4 space-y-6 pb-24">
                {/* Submission method badge */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${isMixed ? 'bg-purple-50 border-purple-100 text-purple-800'
                    : isManual ? 'bg-amber-50 border-amber-100 text-amber-800'
                        : 'bg-blue-50 border-blue-100 text-blue-800'
                    }`}>
                    {isMixed
                        ? <Layers size={18} className="flex-shrink-0" />
                        : isManual ? <Receipt size={18} className="flex-shrink-0" />
                            : <ClipboardList size={18} className="flex-shrink-0" />
                    }
                    <div>
                        <p className="font-semibold">
                            {isMixed ? 'Gabungan Transaksi & Struk Manual'
                                : isManual ? 'Upload Struk Manual'
                                    : 'Dari Riwayat Transaksi'}
                        </p>
                        <p className="text-xs opacity-80">
                            {isMixed
                                ? `${selectedTransactions.length} item dipilih · Total Rp ${(grandTotal || 0).toLocaleString('id-ID')}`
                                : isManual ? 'ID transaksi akan digenerate otomatis'
                                    : `ID: ${prefilledTransactionId}`
                            }
                        </p>
                    </div>
                </div>

                {/* Info notice */}
                {!editMode ? (
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-sm text-neutral-700 flex gap-3">
                        <AlertCircle className="flex-shrink-0 mt-0.5 text-neutral-500" size={18} />
                        <p className="text-xs">Pastikan semua data yang Anda berikan akurat dan lengkap untuk mempercepat proses verifikasi.</p>
                    </div>
                ) : (
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-sm text-blue-900 flex gap-3">
                        <AlertCircle className="flex-shrink-0 mt-0.5 text-blue-600" size={18} />
                        <p className="text-xs">Anda sedang menggunakan mode edit. Merubah jenis bukti akan mengganti file sebelumnya secara keseluruhan jika diisi.</p>
                    </div>
                )}

                <div className="space-y-5">
                    {/* MIXED: multi-transaction summary table */}
                    {isMixed && selectedTransactions && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-900">Transaksi yang Dikomplain</label>
                            <div className="bg-neutral-50 rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
                                {selectedTransactions.map((txn, i) => (
                                    <div key={txn.id} className="flex items-center gap-3 px-4 py-3">
                                        {txn.source === 'manual'
                                            ? <Receipt size={14} className="text-amber-500 flex-shrink-0" />
                                            : <ClipboardList size={14} className="text-[#1B4E9B] flex-shrink-0" />
                                        }
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-neutral-900 truncate">{txn.fuelLabel || txn.product || 'BBM'}</p>
                                            <p className="text-[11px] text-neutral-500 truncate">{txn.spbu || txn.location}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs font-bold text-neutral-900">Rp {txn.amount.toLocaleString('id-ID')}</p>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${txn.source === 'manual'
                                                ? 'bg-amber-50 text-amber-700'
                                                : 'bg-blue-50 text-[#1B4E9B]'
                                                }`}>
                                                {txn.source === 'manual' ? 'Struk Manual' : 'Digital'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between px-4 py-3 bg-neutral-100">
                                    <span className="text-xs font-bold text-neutral-700">Total</span>
                                    <span className="text-sm font-extrabold text-[#1B4E9B]">Rp {(grandTotal || 0).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DIGITAL: show read-only transaction info */}
                    {!isManual && selectedTransaction && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-900">Informasi Transaksi</label>
                            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">SPBU</span>
                                    <span className="font-medium text-neutral-900">{selectedTransaction.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Tanggal</span>
                                    <span className="font-medium text-neutral-900">{formatDate(selectedTransaction.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Jenis BBM</span>
                                    <span className="font-medium text-neutral-900">{selectedTransaction.product}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Nilai</span>
                                    <span className="font-medium text-neutral-900">Rp {selectedTransaction.amount.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">ID Transaksi</span>
                                    <span className="font-mono text-xs font-medium text-neutral-900">{selectedTransaction.id}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MANUAL: editable transaction fields */}
                    {isManual && (
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-neutral-900 block">Informasi Transaksi Manual</label>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-600">Nama SPBU <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: SPBU 31.123.45"
                                    className={`w-full p-3 rounded-xl border ${errors.manualSpbu ? 'border-red-300' : 'border-neutral-200'} focus:ring-2 focus:ring-[#1B4E9B] outline-none`}
                                    value={formData.manualSpbu}
                                    onChange={e => setFormData({ ...formData, manualSpbu: e.target.value })}
                                />
                                {errors.manualSpbu && <p className="text-xs text-red-500">{errors.manualSpbu}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-600">Tanggal Transaksi <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    className={`w-full p-3 rounded-xl border ${errors.manualDate ? 'border-red-300' : 'border-neutral-200'} focus:ring-2 focus:ring-[#1B4E9B] outline-none bg-white`}
                                    value={formData.manualDate}
                                    onChange={e => setFormData({ ...formData, manualDate: e.target.value })}
                                />
                                {errors.manualDate && <p className="text-xs text-red-500">{errors.manualDate}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-600">Jenis BBM <span className="text-red-500">*</span></label>
                                <select
                                    className={`w-full p-3 rounded-xl border ${errors.manualFuelType ? 'border-red-300' : 'border-neutral-200'} focus:ring-2 focus:ring-[#1B4E9B] outline-none bg-white`}
                                    value={formData.manualFuelType}
                                    onChange={e => setFormData({ ...formData, manualFuelType: e.target.value })}
                                >
                                    <option value="">-- Pilih jenis BBM --</option>
                                    {FUEL_TYPES.map(f => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>
                                {errors.manualFuelType && <p className="text-xs text-red-500">{errors.manualFuelType}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-neutral-600">Estimasi Nilai Transaksi (Rp) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    placeholder="Contoh: 50000"
                                    className={`w-full p-3 rounded-xl border ${errors.manualAmount ? 'border-red-300' : 'border-neutral-200'} focus:ring-2 focus:ring-[#1B4E9B] outline-none`}
                                    value={formData.manualAmount}
                                    onChange={e => setFormData({ ...formData, manualAmount: e.target.value })}
                                />
                                {errors.manualAmount && <p className="text-xs text-red-500">{errors.manualAmount}</p>}
                            </div>
                        </div>
                    )}

                    {/* Issue Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-900">
                            Jenis Kendala <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            className={`w-full p-3 rounded-xl border ${errors.issueType ? 'border-red-300' : 'border-neutral-200'} focus:ring-2 focus:ring-[#1B4E9B] outline-none transition-all bg-white`}
                            value={formData.issueType}
                            onChange={e => setFormData({ ...formData, issueType: e.target.value })}
                        >
                            <option value="">-- Pilih jenis kendala --</option>
                            {ISSUE_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                        {errors.issueType && <p className="text-xs text-red-500">{errors.issueType}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-900">
                            Deskripsi Kendala <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Jelaskan kendala kendaraan Anda secara singkat dan detail..."
                            required
                            rows={4}
                            className={`w-full p-3 rounded-xl border ${errors.description ? 'border-red-300' : 'border-neutral-200'} focus:ring-2 focus:ring-[#1B4E9B] outline-none transition-all resize-none`}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            maxLength={500}
                        />
                        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                        <p className="text-xs text-neutral-500">{formData.description.length}/500 karakter</p>
                    </div>

                    {/* Upload Bukti — structured sections */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Upload Bukti</h3>
                            <p className="text-xs text-neutral-500 mt-0.5">Maks 10MB per file • JPG, PNG, PDF, MP4, MOV</p>
                        </div>

                        {/* 1. Struk — Required */}
                        <EvidenceUploadBox
                            id="evidence-struk"
                            icon={<Receipt size={20} className="text-[#1B4E9B]" />}
                            label="Foto Struk / Bukti Transaksi BBM"
                            required
                            hint="Foto struk pembelian BBM dari SPBU."
                            accept="image/*,.pdf"
                            acceptLabel="JPG, PNG, PDF"
                            files={evidence.struk}
                            error={errors.struk}
                            multiple
                            onChange={e => handleEvidenceChange('struk', e, true)}
                            onRemove={i => removeEvidence('struk', i)}
                        />

                        {/* 2. Foto Kendaraan — Required */}
                        <EvidenceUploadBox
                            id="evidence-vehicle"
                            icon={<FileImage size={20} className="text-emerald-600" />}
                            label="Foto Kondisi Kendaraan"
                            required
                            hint="Foto mesin, tangki, atau bagian kendaraan yang terdampak."
                            accept="image/*"
                            acceptLabel="JPG, PNG"
                            files={evidence.vehicle}
                            error={errors.vehicle}
                            multiple
                            onChange={e => handleEvidenceChange('vehicle', e, true)}
                            onRemove={i => removeEvidence('vehicle', i)}
                        />

                        {/* 3. Video Suara Mesin — Optional */}
                        <EvidenceUploadBox
                            id="evidence-video"
                            icon={<FileVideo size={20} className="text-purple-600" />}
                            label="Video Suara Mesin"
                            hint="Video singkat suara mesin yang tidak normal (opsional)."
                            accept="video/mp4,video/quicktime"
                            acceptLabel="MP4, MOV"
                            files={evidence.video}
                            error={errors.video}
                            onChange={e => handleEvidenceChange('video', e, false)}
                            onRemove={i => removeEvidence('video', i)}
                        />

                        {/* 4. Nota Servis — Required */}
                        <EvidenceUploadBox
                            id="evidence-workshop"
                            icon={<Wrench size={20} className="text-amber-600" />}
                            label="Nota Servis Bengkel"
                            required
                            hint="Upload nota servis dari bengkel tempat kendaraan diperiksa."
                            accept="image/*,.pdf"
                            acceptLabel="JPG, PNG, PDF"
                            files={evidence.workshop}
                            error={errors.workshop}
                            multiple
                            onChange={e => handleEvidenceChange('workshop', e, true)}
                            onRemove={i => removeEvidence('workshop', i)}
                        />

                        {/* 5. Bukti Tambahan — Optional */}
                        <EvidenceUploadBox
                            id="evidence-additional"
                            icon={<FileText size={20} className="text-sky-600" />}
                            label="Bukti Tambahan"
                            hint="Dokumen, foto, atau file lain yang mendukung aduan Anda (opsional)."
                            accept="image/*,.pdf,video/mp4,video/quicktime,.doc,.docx"
                            acceptLabel="JPG, PNG, PDF, MP4, DOC"
                            files={evidence.additional}
                            error={errors.additional}
                            multiple
                            onChange={e => handleEvidenceChange('additional', e, true)}
                            onRemove={i => removeEvidence('additional', i)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white border-t border-neutral-100 z-20">
                    <Button
                        type="submit"
                        variant="default"
                        className="w-full font-bold shadow-lg text-white bg-[#1B4E9B] hover:bg-[#1B4E9B]/90"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Memproses...' : (editMode ? 'Simpan Perubahan' : 'Kirim Komplain')}
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default ClaimForm;
