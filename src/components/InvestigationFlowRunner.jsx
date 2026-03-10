import { useEffect, useRef } from 'react';
import { useClaims } from '@/context/ClaimContext';
import { useNotifications } from '@/context/NotificationContext';
import { startInvestigationFlow } from '@/lib/useInvestigationFlow';

/**
 * Persistent root-level component that watches for newly submitted claims
 * and starts the investigation flow for each one.
 *
 * Lives in App.jsx so it NEVER unmounts — timers survive page navigation.
 */
const InvestigationFlowRunner = () => {
    const { claims, updateClaimStatus } = useClaims();
    const { addNotification } = useNotifications();
    // Track which claim IDs we've already started a flow for
    const startedRef = useRef(new Set());

    useEffect(() => {
        claims.forEach(claim => {
            // Only start for brand-new claims (not mock seed data).
            // A freshly submitted claim has status 'received' or no final decision,
            // and we haven't started a flow for it yet.
            if (startedRef.current.has(claim.id)) return;

            // Heuristic: real new claims will have a submittedDate within the last
            // 5 minutes (they were just created this session).
            if (!claim.submittedDate) return;
            const ageMs = Date.now() - new Date(claim.submittedDate).getTime();
            if (ageMs > 5 * 60 * 1000) return; // older than 5 min → seed data, skip

            // Mark as started immediately to prevent double-firing
            startedRef.current.add(claim.id);
            startInvestigationFlow(claim.id, updateClaimStatus, addNotification);
        });
        // Re-run whenever claims array changes (new claim added)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claims.length]);

    return null; // renders nothing
};

export default InvestigationFlowRunner;
