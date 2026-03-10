/**
 * startInvestigationFlow — plain function (not a hook).
 * Schedules the 5-stage claim simulation. Returns a cleanup function.
 *
 * Stage timings (ms):
 *   1 — Pengaduan Diterima       1 500
 *   2 — Sedang Diverifikasi     10 000
 *   3 — Sedang Diproses         18 000
 *   4 — Investigasi SPBU        27 000
 *   5 — Keputusan Klaim         36 000  (alternates: approved → rejected → approved …)
 */

// Alternating outcome: 0 = approved, 1 = rejected, 2 = approved, …
let _outcomeCounter = 0;
export const startInvestigationFlow = (claimId, updateClaimStatus, addNotification, forceOutcome = null) => {
    if (!claimId || claimId === 'Unknown ID') return () => { };

    const timers = [];
    const schedule = (fn, delay) => timers.push(setTimeout(fn, delay));

    // ── DEV / DEMO shortcut ──────────────────────────────────────────────────
    // When forceOutcome is 'approved' or 'rejected', skip intermediate stages
    // and fire the final decision after 1 second (for a visible status flip).
    if (forceOutcome === 'approved' || forceOutcome === 'rejected') {
        const now = new Date().toISOString();
        // Quickly mark all intermediate steps as done
        const intermediateSteps = [
            { key: 'received', label: 'Pengaduan Diterima' },
            { key: 'verifying', label: 'Sedang Diverifikasi' },
            { key: 'process', label: 'Sedang Diproses' },
            { key: 'investigation', label: 'Investigasi SPBU' },
        ];
        intermediateSteps.forEach((step, i) => {
            schedule(() => {
                updateClaimStatus(claimId, {
                    status: step.key,
                    timelineStep: { key: step.key, label: step.label, date: now, done: true },
                });
            }, i * 200); // fast cascading steps
        });

        // Fire the forced final outcome after 1 s
        schedule(() => {
            const decisionNow = new Date().toISOString();
            if (forceOutcome === 'approved') {
                const steps = Math.floor(Math.random() * 11);
                const compensationAmount = 250_000 + steps * 50_000;
                updateClaimStatus(claimId, {
                    status: 'done', decisionAt: decisionNow, compensationAmount,
                    timelineStep: { key: 'done', label: 'Klaim Disetujui', date: decisionNow, done: true, outcome: 'approved' },
                });
                addNotification({
                    type: 'complaint_approved', claimId,
                    title: 'Klaim Anda Disetujui ✅',
                    message: `Pengaduan ${claimId} telah disetujui. Estimasi kompensasi: Rp ${compensationAmount.toLocaleString('id-ID')}.`,
                    deepLink: `/komplain-bbm/${claimId}`,
                    category: 'Complaint',
                });
            } else {
                updateClaimStatus(claimId, {
                    status: 'rejected', rejectedAt: decisionNow,
                    rejectionReason: 'Setelah dilakukan investigasi, bukti yang dilampirkan belum memenuhi persyaratan klaim. Anda dapat mengajukan sanggahan dalam waktu 3 hari.',
                    timelineStep: { key: 'done', label: 'Klaim Ditolak', date: decisionNow, done: true, outcome: 'rejected' },
                });
                addNotification({
                    type: 'complaint_rejected', claimId,
                    title: 'Klaim Tidak Dapat Diproses ❌',
                    message: 'Setelah dilakukan investigasi, pengaduan Anda belum dapat disetujui. Anda dapat mengajukan sanggahan dalam waktu 3 hari.',
                    deepLink: `/komplain-bbm/${claimId}`,
                    category: 'Complaint',
                });
            }
        }, 1000);

        return () => timers.forEach(clearTimeout);
    }
    // ────────────────────────────────────────────────────────────────────────

    // Stage 1 — Pengaduan Diterima
    schedule(() => {
        const now = new Date().toISOString();
        updateClaimStatus(claimId, {
            status: 'received',
            timelineStep: { key: 'received', label: 'Pengaduan Diterima', date: now, done: true },
        });
        addNotification({
            type: 'complaint_submission', claimId,
            title: 'Pengaduan Berhasil Diterima',
            message: `Pengaduan Anda dengan nomor ${claimId} telah kami terima. Tim kami akan melakukan verifikasi awal sebelum proses investigasi.`,
            deepLink: `/komplain-bbm/${claimId}`,
            category: 'Complaint',
        });
    }, 1500);

    // Stage 2 — Sedang Diverifikasi
    schedule(() => {
        const now = new Date().toISOString();
        updateClaimStatus(claimId, {
            status: 'verifying',
            timelineStep: { key: 'verifying', label: 'Sedang Diverifikasi', date: now, done: true },
        });
        addNotification({
            type: 'complaint_verifying', claimId,
            title: 'Pengaduan Sedang Diverifikasi',
            message: 'Pengaduan Anda sedang melalui proses verifikasi awal. Kami sedang memastikan detail transaksi dan bukti yang Anda lampirkan.',
            deepLink: `/komplain-bbm/${claimId}`,
            category: 'Complaint',
        });
    }, 10000);

    // Stage 3 — Sedang Diproses
    schedule(() => {
        const now = new Date().toISOString();
        updateClaimStatus(claimId, {
            status: 'process',
            timelineStep: { key: 'process', label: 'Sedang Diproses', date: now, done: true },
        });
        addNotification({
            type: 'complaint_processing', claimId,
            title: 'Pengaduan Sedang Diproses',
            message: 'Verifikasi data Anda telah selesai. Pengaduan kini sedang diproses lebih lanjut oleh tim kami.',
            deepLink: `/komplain-bbm/${claimId}`,
            category: 'Complaint',
        });
    }, 18000);

    // Stage 4 — Investigasi SPBU
    schedule(() => {
        const now = new Date().toISOString();
        updateClaimStatus(claimId, {
            status: 'investigation',
            timelineStep: { key: 'investigation', label: 'Investigasi SPBU', date: now, done: true },
        });
        addNotification({
            type: 'complaint_investigation', claimId,
            title: 'Investigasi Sedang Dilakukan',
            message: 'Tim Pertamina sedang melakukan investigasi terkait pengaduan Anda. Proses ini dapat melibatkan pengecekan di SPBU terkait.',
            deepLink: `/komplain-bbm/${claimId}`,
            category: 'Complaint',
        });
    }, 27000);

    // Stage 5 — Keputusan Klaim (randomized)
    schedule(() => {
        const approved = (_outcomeCounter++ % 2) === 0; // even = approved, odd = rejected
        const now = new Date().toISOString();

        if (approved) {
            // Random compensation between Rp 250.000 – Rp 750.000 (multiples of 50.000)
            const steps = Math.floor(Math.random() * 11); // 0–10
            const compensationAmount = 250_000 + steps * 50_000;
            const formattedAmount = compensationAmount.toLocaleString('id-ID');

            updateClaimStatus(claimId, {
                status: 'done', decisionAt: now, compensationAmount,
                timelineStep: { key: 'done', label: 'Klaim Disetujui', date: now, done: true, outcome: 'approved' },
            });
            addNotification({
                type: 'complaint_approved', claimId,
                title: 'Klaim Anda Disetujui ✅',
                message: `Pengaduan ${claimId} telah disetujui. Estimasi kompensasi: Rp ${formattedAmount}. Ketuk untuk melihat detail klaim.`,
                deepLink: `/komplain-bbm/${claimId}`,
                category: 'Complaint',
            });
        } else {
            updateClaimStatus(claimId, {
                status: 'rejected', rejectedAt: now,
                rejectionReason: 'Setelah dilakukan investigasi, bukti yang dilampirkan belum memenuhi persyaratan klaim. Anda dapat mengajukan sanggahan dalam waktu 3 hari.',
                timelineStep: { key: 'done', label: 'Klaim Ditolak', date: now, done: true, outcome: 'rejected' },
            });
            addNotification({
                type: 'complaint_rejected', claimId,
                title: 'Klaim Tidak Dapat Diproses ❌',
                message: 'Setelah dilakukan investigasi, pengaduan Anda belum dapat disetujui. Anda dapat mengajukan sanggahan dalam waktu 3 hari.',
                deepLink: `/komplain-bbm/${claimId}`,
                category: 'Complaint',
            });
        }
    }, 36000);

    // Return cleanup
    return () => timers.forEach(clearTimeout);
};

/**
 * Legacy hook wrapper — kept for backward compat but is now a no-op.
 * The flow is started by InvestigationFlowRunner in App.jsx.
 */
const useInvestigationFlow = (_claimId) => { };
export default useInvestigationFlow;

// Separate alternating counter for rebuttal outcomes
let _rebuttalCounter = 0;

/**
 * startRebuttalFlow — fires the 3-stage appeal simulation.
 * Timings: instant (submission), 8s (review), 20s (final outcome)
 */
export const startRebuttalFlow = (claimId, updateClaimStatus, addNotification, forceOutcome = null) => {
    if (!claimId) return () => { };
    const timers = [];
    const schedule = (fn, delay) => timers.push(setTimeout(fn, delay));

    // ── DEV / DEMO shortcut ───────────────────────────────────────────────────
    if (forceOutcome === 'accepted' || forceOutcome === 'rejected') {
        // Instant submission notification
        addNotification({
            type: 'rebuttal_submitted', claimId,
            title: 'Sanggahan Anda Telah Diajukan',
            message: `Sanggahan untuk klaim ${claimId} telah kami terima. Tim kami akan meninjau kembali pengaduan Anda.`,
            deepLink: `/komplain-bbm/${claimId}`,
            category: 'Rebuttal',
        });
        // Fire the forced final outcome after 1 s
        schedule(() => {
            const now = new Date().toISOString();
            if (forceOutcome === 'accepted') {
                const steps = Math.floor(Math.random() * 11);
                const compensationAmount = 250_000 + steps * 50_000;
                updateClaimStatus(claimId, {
                    status: 'rebuttal_accepted', decisionAt: now, compensationAmount,
                    timelineStep: { key: 'rebuttal_accepted', label: 'Sanggahan Diterima', date: now, done: true, outcome: 'rebuttal_accepted' },
                });
                addNotification({
                    type: 'rebuttal_accepted', claimId,
                    title: 'Sanggahan Anda Diterima ✅',
                    message: `Setelah peninjauan ulang, klaim ${claimId} disetujui sesuai ketentuan program. Estimasi kompensasi: Rp ${compensationAmount.toLocaleString('id-ID')}.`,
                    deepLink: `/komplain-bbm/${claimId}`,
                    category: 'Rebuttal',
                });
            } else {
                updateClaimStatus(claimId, {
                    status: 'rebuttal_rejected', decisionAt: now,
                    timelineStep: { key: 'rebuttal_rejected', label: 'Sanggahan Ditolak', date: now, done: true, outcome: 'rebuttal_rejected' },
                });
                addNotification({
                    type: 'rebuttal_rejected', claimId,
                    title: 'Sanggahan Anda Ditolak ❌',
                    message: `Setelah peninjauan ulang, keputusan sebelumnya untuk klaim ${claimId} tetap berlaku.`,
                    deepLink: `/komplain-bbm/${claimId}`,
                    category: 'Rebuttal',
                });
            }
        }, 1000);
        return () => timers.forEach(clearTimeout);
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Stage 1 — Sanggahan Diajukan (instant)
    addNotification({
        type: 'rebuttal_submitted', claimId,
        title: 'Sanggahan Anda Telah Diajukan',
        message: `Sanggahan untuk klaim ${claimId} telah kami terima. Tim kami akan meninjau kembali pengaduan Anda.`,
        deepLink: `/komplain-bbm/${claimId}`,
        category: 'Rebuttal',
    });

    // Stage 2 — Peninjauan Ulang (8 s)
    schedule(() => {
        const now = new Date().toISOString();
        updateClaimStatus(claimId, {
            status: 'reviewing',
            timelineStep: { key: 'reviewing', label: 'Peninjauan Ulang', date: now, done: true },
        });
        addNotification({
            type: 'rebuttal_reviewing', claimId,
            title: 'Sanggahan Sedang Ditinjau',
            message: 'Tim kami sedang melakukan peninjauan ulang terhadap sanggahan Anda. Estimasi waktu: 3–5 hari kerja.',
            deepLink: `/komplain-bbm/${claimId}`,
            category: 'Rebuttal',
        });
    }, 8000);

    // Stage 3 — Final outcome (20 s, alternating)
    schedule(() => {
        const accepted = (_rebuttalCounter++ % 2) === 0;
        const now = new Date().toISOString();

        if (accepted) {
            const steps = Math.floor(Math.random() * 11);
            const compensationAmount = 250_000 + steps * 50_000;
            updateClaimStatus(claimId, {
                status: 'rebuttal_accepted', decisionAt: now, compensationAmount,
                timelineStep: { key: 'rebuttal_accepted', label: 'Sanggahan Diterima', date: now, done: true, outcome: 'rebuttal_accepted' },
            });
            addNotification({
                type: 'rebuttal_accepted', claimId,
                title: 'Sanggahan Anda Diterima ✅',
                message: `Setelah peninjauan ulang, klaim ${claimId} disetujui sesuai ketentuan program. Estimasi kompensasi: Rp ${compensationAmount.toLocaleString('id-ID')}.`,
                deepLink: `/komplain-bbm/${claimId}`,
                category: 'Rebuttal',
            });
        } else {
            updateClaimStatus(claimId, {
                status: 'rebuttal_rejected', decisionAt: now,
                timelineStep: { key: 'rebuttal_rejected', label: 'Sanggahan Ditolak', date: now, done: true, outcome: 'rebuttal_rejected' },
            });
            addNotification({
                type: 'rebuttal_rejected', claimId,
                title: 'Sanggahan Anda Ditolak ❌',
                message: `Setelah peninjauan ulang, keputusan sebelumnya untuk klaim ${claimId} tetap berlaku.`,
                deepLink: `/komplain-bbm/${claimId}`,
                category: 'Rebuttal',
            });
        }
    }, 20000);

    return () => timers.forEach(clearTimeout);
};

