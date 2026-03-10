import React from 'react';
import { cn } from '@/lib/utils';

const StatusBadge = ({ status, className }) => {
    const styles = {
        received: "bg-status-received text-status-receivedText",
        process: "bg-status-process text-status-processText",
        done: "bg-status-done text-status-doneText",
        rejected: "bg-status-rejected text-status-rejectedText",
        default: "bg-gray-100 text-gray-600"
    };

    const labels = {
        received: "Diterima",
        process: "Diproses",
        done: "Selesai",
        rejected: "Ditolak",
        default: status
    };

    // Normalizing status string to match keys
    const statusKey = Object.keys(styles).includes(status?.toLowerCase()) ? status.toLowerCase() : 'default';

    return (
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", styles[statusKey], className)}>
            {labels[statusKey] || status}
        </span>
    );
};

export default StatusBadge;
