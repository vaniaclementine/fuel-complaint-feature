import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { useClaims } from '@/context/ClaimContext';
import { useNotifications } from '@/context/NotificationContext';
import { startRebuttalFlow } from '@/lib/useInvestigationFlow';
import { UploadCloud, X, FileImage, AlertCircle, Clock } from 'lucide-react';
import { FILE_UPLOAD, SLA } from '@/lib/constants';

const RebuttalForm = () => {
    const { claimId } = useParams();
    const navigate = useNavigate();
    const { claims, submitRebuttal, updateClaimStatus } = useClaims();
    const { addNotification } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    const claim = claims.find(c => c.id === claimId);

    if (!claim || claim.status !== 'rejected') {
        return (
            <Layout showBottomNav={false}>
                <Header title="Ajukan Sanggahan" />
                <div className="p-4 text-center py-16">
                    <AlertCircle className="text-neutral-400 mx-auto mb-3" size={48} />
                    <p className="text-neutral-500">Klaim tidak ditemukan atau tidak bisa diajukan sanggahan.</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate('/komplain-bbm/riwayat')}
                    >
                        Kembali ke Riwayat
                    </Button>
                </div>
            </Layout>
        );
    }

    // Calculate H+3 deadline
    const submittedDate = new Date(claim.submittedDate);
    const deadlineDate = new Date(submittedDate.getTime() + (SLA.AUTO_CLOSE_HOURS * 60 * 60 * 1000));
    const hoursRemaining = Math.max(0, (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60));

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            const oversizedFiles = newFiles.filter(f => f.size > FILE_UPLOAD.MAX_SIZE_BYTES);
            if (oversizedFiles.length > 0) {
                setErrors({ ...errors, files: `Beberapa file melebihi ukuran maksimal ${FILE_UPLOAD.MAX_SIZE_MB}MB` });
                return;
            }

            const invalidFiles = newFiles.filter(f => !FILE_UPLOAD.ACCEPTED_TYPES.includes(f.type));
            if (invalidFiles.length > 0) {
                setErrors({ ...errors, files: 'Format file tidak didukung. Gunakan JPG, PNG, atau PDF' });
                return;
            }

            setFiles([...files, ...newFiles]);
            setErrors({ ...errors, files: null });
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description.trim()) {
            setErrors({ description: 'Deskripsi sanggahan tidak boleh kosong' });
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        submitRebuttal(claimId, {
            description,
            files: files.map(f => ({ name: f.name, size: f.size })),
            submittedDate: new Date().toISOString(),
        });

        // Start the rebuttal simulation flow (timers survive navigation)
        startRebuttalFlow(claimId, updateClaimStatus, addNotification);

        setIsSubmitting(false);
        navigate(`/komplain-bbm/${claimId}`, { state: { rebuttalSuccess: true } });
    };

    return (
        <Layout showBottomNav={false}>
            <Header title="Ajukan Sanggahan" />

            <form onSubmit={handleSubmit} className="p-4 space-y-6 pb-24">
                {/* Deadline Warning */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm flex gap-3">
                    <Clock className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-amber-900 mb-1">Batas Waktu Sanggahan</p>
                        <p className="text-xs text-amber-800">
                            Sanggahan harus diajukan maksimal H+3 dari tanggal penolakan.
                            <span className="block mt-1 font-medium">
                                Waktu tersisa: {Math.floor(hoursRemaining)} jam
                            </span>
                        </p>
                    </div>
                </div>

                {/* Original Claim Info */}
                <div>
                    <h3 className="text-sm font-semibold text-neutral-900 mb-2">Informasi Klaim</h3>
                    <div className="bg-neutral-50 p-3 rounded-lg space-y-1 text-xs">
                        <p><span className="font-medium">Nomor Klaim:</span> {claim.id}</p>
                        <p><span className="font-medium">Alasan Penolakan:</span> {claim.rejectionReason || 'Tidak memenuhi persyaratan'}</p>
                    </div>
                </div>

                {/* Rebuttal Description */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-900">
                        Penjelasan Sanggahan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        placeholder="Jelaskan mengapa Anda tidak setuju dengan keputusan penolakan dan berikan penjelasan tambahan..."
                        required
                        rows={5}
                        className={`w-full p-3 rounded-xl border ${errors.description ? 'border-red-300' : 'border-neutral-200'} focus:ring-2 focus:ring-[#1B4E9B] outline-none transition-all resize-none`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500">{errors.description}</p>
                    )}
                </div>

                {/* Additional Evidence */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-900">
                        Upload Bukti Tambahan (Opsional)
                    </label>
                    <div className={`border-2 border-dashed ${errors.files ? 'border-red-300' : 'border-neutral-300'} rounded-xl p-6 text-center hover:bg-neutral-50 transition-colors`}>
                        <input
                            type="file"
                            multiple
                            accept={FILE_UPLOAD.ACCEPTED_EXTENSIONS.join(',')}
                            className="hidden"
                            id="file-upload-rebuttal"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload-rebuttal" className="cursor-pointer flex flex-col items-center">
                            <UploadCloud className="text-neutral-400 mb-2" size={32} />
                            <span className="text-sm text-[#1B4E9B] font-medium">Klik untuk upload</span>
                            <span className="text-xs text-neutral-400 mt-1">
                                Maksimal {FILE_UPLOAD.MAX_SIZE_MB}MB per file
                            </span>
                        </label>
                    </div>

                    {errors.files && (
                        <p className="text-xs text-red-500">{errors.files}</p>
                    )}

                    {/* File Preview */}
                    {files.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <FileImage className="text-[#1B4E9B] flex-shrink-0" size={18} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-neutral-900">{file.name}</p>
                                            <p className="text-xs text-neutral-500">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="text-neutral-400 hover:text-red-500 p-2 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-white border-t border-neutral-100 z-20">
                    <Button
                        type="submit"
                        variant="default"
                        className="w-full font-bold shadow-lg text-white bg-[#1B4E9B] hover:bg-[#1B4E9B]/90"
                        disabled={isSubmitting || hoursRemaining <= 0}
                    >
                        {isSubmitting ? 'Mengirim Sanggahan...' : 'Submit Sanggahan'}
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default RebuttalForm;
