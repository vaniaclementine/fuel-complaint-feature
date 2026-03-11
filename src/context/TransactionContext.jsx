import React, { createContext, useContext, useState } from 'react';
import { MANUAL_TXN_PREFIX } from '@/lib/constants';

const TransactionContext = createContext();

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within TransactionProvider');
    }
    return context;
};

// Mock transaction data — all fuel types
const mockTransactions = [
    {
        id: 'TXN-001',
        type: 'bbm',
        product: 'Pertamax Green 95',
        fuelType: 'pertamax_green',
        amount: 850000,
        liters: 60.5,
        date: '2026-02-26T20:39:00',
        location: 'SPBU 31.123.45',
        address: 'Jl. Sudirman No. 45, Jakarta Pusat',
        nozzle: '3',
        status: 'success',
        canClaim: true,
    },
    {
        id: 'TXN-002',
        type: 'bbm',
        product: 'Pertamax',
        fuelType: 'pertamax',
        amount: 350000,
        liters: 25.6,
        date: '2026-02-24T15:20:00',
        location: 'SPBU 31.123.46',
        address: 'Jl. Gatot Subroto No. 12, Jakarta Selatan',
        nozzle: '1',
        status: 'success',
        canClaim: true,
    },
    {
        id: 'TXN-003',
        type: 'bbm',
        product: 'Pertamax Turbo',
        fuelType: 'pertamax_turbo',
        amount: 150000,
        liters: 9.2,
        date: '2026-02-22T18:00:00',
        location: 'SPBU 31.123.45',
        address: 'Jl. Sudirman No. 45, Jakarta Pusat',
        nozzle: '5',
        status: 'success',
        canClaim: true,
    },
    {
        id: 'TXN-004',
        type: 'bbm',
        product: 'Pertalite',
        fuelType: 'pertalite',
        amount: 30000,
        liters: 4.3,
        date: '2026-02-18T09:15:00',
        location: 'SPBU 31.123.47',
        address: 'Jl. Thamrin No. 8, Jakarta Pusat',
        nozzle: '2',
        status: 'success',
        canClaim: true,
    },
    {
        id: 'TXN-005',
        type: 'bbm',
        product: 'Dex',
        fuelType: 'dex',
        amount: 450000,
        liters: 31.5,
        date: '2026-02-15T14:30:00',
        location: 'SPBU 31.789.10',
        address: 'Jl. Rasuna Said No. 20, Jakarta Selatan',
        nozzle: '4',
        status: 'success',
        canClaim: true,
    },
    {
        id: 'TXN-006',
        type: 'e-voucher',
        product: 'Voucher BBM Rp 100.000',
        fuelType: null,
        amount: 100000,
        liters: null,
        date: '2026-02-15T14:30:00',
        location: 'Digital Purchase',
        address: null,
        nozzle: null,
        status: 'success',
        canClaim: false,
    },
];

// Generate system-level manual transaction ID
let manualCounter = 1;
export const generateManualTxnId = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(manualCounter++).padStart(3, '0');
    return `${MANUAL_TXN_PREFIX}-${dateStr}-${seq}`;
};

export const TransactionProvider = ({ children }) => {
    const [transactions] = useState(mockTransactions);
    const [activeFilter, setActiveFilter] = useState('all');

    // Check if a transaction is a fuel transaction eligible for complaint
    const isFuelTransaction = (txn) => txn.type === 'bbm' && txn.canClaim;

    // Check if user has eligibility (at least one BBM transaction)
    const hasEligibility = () => {
        return transactions.some(t => isFuelTransaction(t));
    };

    // Check if transaction is within the complaint window (≤90 days)
    const isWithinClaimWindow = (txn) => {
        const txnDate = new Date(txn.date);
        const now = new Date();
        const diffDays = (now - txnDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 90;
    };

    // Get eligible transactions for complaint (BBM + within 90 days)
    const getEligibleTransactions = () => {
        return transactions.filter(t => isFuelTransaction(t) && isWithinClaimWindow(t));
    };

    // Get filtered transactions (for the activity screen)
    const getFilteredTransactions = () => {
        if (activeFilter === 'all') {
            return transactions;
        }
        return transactions.filter(t => t.type === activeFilter);
    };

    // Get transaction by ID
    const getTransaction = (id) => {
        return transactions.find(t => t.id === id);
    };

    // Format date to Indonesian format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options).replace('.', '');
    };

    const formatDateShort = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const value = {
        transactions,
        activeFilter,
        setActiveFilter,
        hasEligibility,
        isFuelTransaction,
        isWithinClaimWindow,
        getEligibleTransactions,
        getFilteredTransactions,
        getTransaction,
        formatDate,
        formatDateShort,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};
