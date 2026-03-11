import React, { createContext, useContext, useState } from 'react';

const ClaimContext = createContext();

export const useClaims = () => useContext(ClaimContext);

export const ClaimProvider = ({ children }) => {
    const [claims, setClaims] = useState([
        {
            id: 'CLM-9876',
            transactionId: 'TXN-001',
            submissionMethod: 'digital',
            date: '2026-01-20',
            submittedDate: '2026-01-20T10:30:00',
            status: 'done',
            decisionAt: '2026-01-24T14:00:00',
            compensationAmount: 75000,
            issueType: 'Mesin Brebet',
            description: 'Mesin mati mendadak setelah isi Pertamax Green 95 di SPBU ini. Kendaraan brebet dan tidak bisa dinyalakan kembali.',
            location: 'SPBU 31.123.45',
            product: 'Pertamax Green 95',
            amount: 75000,
            files: [
                { name: 'foto-struk.jpg', size: 245678 },
                { name: 'foto-mesin.jpg', size: 389012 }
            ],
            statusTimeline: [
                { key: 'received', label: 'Pengaduan Diterima', date: '2026-01-20T10:30:00', done: true },
                { key: 'verifying', label: 'Sedang Diverifikasi', date: '2026-01-20T11:00:00', done: true },
                { key: 'process', label: 'Sedang Diproses', date: '2026-01-21T08:00:00', done: true },
                { key: 'investigation', label: 'Investigasi SPBU', date: '2026-01-22T10:00:00', done: true },
                { key: 'done', label: 'Keputusan Komplain', date: '2026-01-24T14:00:00', done: true },
            ]
        },
        {
            id: 'CLM-9875',
            transactionId: 'TXN-002',
            submissionMethod: 'digital',
            date: '2026-01-22',
            submittedDate: '2026-01-22T14:15:00',
            status: 'process',
            issueType: 'Suara Mesin Tidak Normal',
            description: 'Suara mesin menjadi kasar dan ada bunyi knocking setelah pengisian Pertamax.',
            location: 'SPBU 31.123.46',
            product: 'Pertamax',
            amount: 50000,
            files: [
                { name: 'video-suara-mesin.mp4', size: 1234567 }
            ],
            statusTimeline: [
                { key: 'received', label: 'Pengaduan Diterima', date: '2026-01-22T14:15:00', done: true },
                { key: 'verifying', label: 'Sedang Diverifikasi', date: '2026-01-22T15:00:00', done: true },
                { key: 'process', label: 'Sedang Diproses', date: '2026-01-23T09:00:00', done: true },
                { key: 'investigation', label: 'Investigasi SPBU', date: null, done: false },
                { key: 'done', label: 'Keputusan Komplain', date: null, done: false },
            ]
        },
        {
            id: 'CLM-9874',
            transactionId: 'MANUAL-20260115-001',
            submissionMethod: 'manual',
            date: '2026-01-15',
            submittedDate: '2026-01-15T09:00:00',
            status: 'rejected',
            rejectedAt: '2026-01-22T16:30:00',
            issueType: 'Performa Kendaraan Menurun',
            description: 'Konsumsi BBM meningkat drastis setelah isi Pertalite.',
            location: 'SPBU 31.123.47',
            product: 'Pertalite',
            amount: 30000,
            rejectionReason: 'Bukti yang dilampirkan tidak cukup menunjukkan hubungan langsung antara pengisian BBM dengan masalah yang dilaporkan. Diperlukan bukti lebih detail seperti hasil pemeriksaan bengkel resmi.',
            files: [
                { name: 'foto-struk-manual.jpg', size: 156789 }
            ],
            rebuttalSubmitted: false,
            statusTimeline: [
                { key: 'received', label: 'Pengaduan Diterima', date: '2026-01-15T09:00:00', done: true },
                { key: 'verifying', label: 'Sedang Diverifikasi', date: '2026-01-15T10:00:00', done: true },
                { key: 'process', label: 'Sedang Diproses', date: '2026-01-16T08:00:00', done: true },
                { key: 'investigation', label: 'Investigasi SPBU', date: '2026-01-18T10:00:00', done: true },
                { key: 'done', label: 'Keputusan Komplain', date: '2026-01-22T16:30:00', done: true },
            ]
        },
        {
            id: 'CLM-9873',
            transactionId: 'TXN-005',
            submissionMethod: 'digital',
            date: '2026-01-10',
            submittedDate: '2026-01-10T11:00:00',
            status: 'rejected',
            rejectedAt: '2026-01-15T14:00:00',
            issueType: 'Mesin Mati Mendadak',
            description: 'Tenaga mesin berkurang setelah pengisian Dex.',
            location: 'SPBU 31.789.10',
            product: 'Dex',
            amount: 150000,
            rejectionReason: 'Tidak ada bukti pemeriksaan teknis dari bengkel resmi yang menunjukkan korelasi antara pengisian BBM dengan penurunan performa.',
            files: [
                { name: 'foto-struk-2.jpg', size: 198765 }
            ],
            rebuttalSubmitted: false,
            statusTimeline: [
                { key: 'received', label: 'Pengaduan Diterima', date: '2026-01-10T11:00:00', done: true },
                { key: 'verifying', label: 'Sedang Diverifikasi', date: '2026-01-10T12:00:00', done: true },
                { key: 'process', label: 'Sedang Diproses', date: '2026-01-11T08:00:00', done: true },
                { key: 'investigation', label: 'Investigasi SPBU', date: '2026-01-13T10:00:00', done: true },
                { key: 'done', label: 'Keputusan Komplain', date: '2026-01-15T14:00:00', done: true },
            ]
        }
    ]);

    const addClaim = (newClaim) => {
        setClaims(prev => [newClaim, ...prev]);
    };

    const submitRebuttal = (claimId, rebuttalData) => {
        setClaims(prev => prev.map(claim => {
            if (claim.id === claimId) {
                return {
                    ...claim,
                    rebuttal: rebuttalData,
                    rebuttalSubmitted: true,
                    status: 'process',
                    statusTimeline: [
                        ...(claim.statusTimeline || []),
                        { key: 'rebuttal', label: 'Sanggahan Diajukan', date: new Date().toISOString(), done: true },
                    ]
                };
            }
            return claim;
        }));
    };

    const getClaim = (claimId) => {
        return claims.find(c => c.id === claimId);
    };

    const updateClaimStatus = (claimId, updates) => {
        setClaims(prev => prev.map(claim => {
            if (claim.id !== claimId) return claim;
            // Merge statusTimeline: append new steps that don't already exist by key
            let mergedTimeline = claim.statusTimeline || [];
            if (updates.timelineStep) {
                const exists = mergedTimeline.some(s => s.key === updates.timelineStep.key);
                if (!exists) {
                    // Mark all previous pending steps as done if needed
                    mergedTimeline = [...mergedTimeline, updates.timelineStep];
                } else {
                    mergedTimeline = mergedTimeline.map(s =>
                        s.key === updates.timelineStep.key ? { ...s, ...updates.timelineStep } : s
                    );
                }
            }
            const { timelineStep, ...rest } = updates;
            return { ...claim, ...rest, statusTimeline: mergedTimeline };
        }));
    };

    const updateClaimData = (claimId, updatedData) => {
        setClaims(prev => prev.map(claim => {
            if (claim.id === claimId) {
                return { ...claim, ...updatedData };
            }
            return claim;
        }));
    };

    return (
        <ClaimContext.Provider value={{ claims, addClaim, submitRebuttal, getClaim, updateClaimStatus, updateClaimData }}>
            {children}
        </ClaimContext.Provider>
    );
};
