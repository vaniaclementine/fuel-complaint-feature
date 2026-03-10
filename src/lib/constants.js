// Fuel Complaint System Constants

// Manual transaction ID prefix
export const MANUAL_TXN_PREFIX = 'MANUAL';

// Fuel Types
export const FUEL_TYPES = [
    { value: 'pertalite', label: 'Pertalite' },
    { value: 'pertamax', label: 'Pertamax' },
    { value: 'pertamax_turbo', label: 'Pertamax Turbo' },
    { value: 'pertamax_green', label: 'Pertamax Green 95' },
    { value: 'dex', label: 'Dex' },
    { value: 'dexlite', label: 'Dexlite' },
    { value: 'other', label: 'Lainnya' },
];

// Issue Types for Complaint Form
export const ISSUE_TYPES = [
    { value: 'engine_sputter', label: 'Mesin Brebet' },
    { value: 'engine_stall', label: 'Mesin Mati Mendadak' },
    { value: 'abnormal_sound', label: 'Suara Mesin Tidak Normal' },
    { value: 'performance', label: 'Performa Kendaraan Menurun' },
    { value: 'fuel_quality', label: 'Kualitas Bahan Bakar' },
    { value: 'other', label: 'Lainnya' },
];

// SLA Definitions
export const SLA = {
    CLAIM_PROCESSING: '3-5 hari kerja',
    INVESTIGATION: '3-5 hari kerja',
    REBUTTAL_WINDOW: 3, // days (H+3)
    AUTO_CLOSE_HOURS: 72, // 3 days in hours
};

// File Upload Requirements
export const FILE_UPLOAD = {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ACCEPTED_TYPES: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/heic',
        'application/pdf', 'video/mp4', 'video/quicktime'
    ],
    ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.heic', '.pdf', '.mp4', '.mov'],
    MIN_FILES: 1,
    MAX_FILES: 5,
    REQUIREMENTS: [
        'Foto struk / bukti transaksi BBM',
        'Foto kondisi kendaraan (mesin, tangki, dll)',
        'Video suara mesin (opsional, sangat membantu)',
        'Nota servis dari bengkel (jika sudah diperbaiki)',
    ]
};

// Eligibility Rules
export const ELIGIBILITY = {
    MIN_FUEL_TRANSACTIONS: 1,
    CLAIM_FREQUENCY_LIMIT: 3, // Maximum claims per month
    CLAIM_WINDOW_DAYS: 7, // Transaction must be within last 7 days
};

// Status Definitions
export const CLAIM_STATUS = {
    RECEIVED: 'received',
    PROCESSING: 'process',
    COMPLETED: 'done',
    REJECTED: 'rejected',
};

// Status Timeline Steps
export const STATUS_TIMELINE = [
    { key: 'received', label: 'Pengajuan Diterima' },
    { key: 'process', label: 'Sedang Diproses' },
    { key: 'investigation', label: 'Investigasi SPBU' },
    { key: 'done', label: 'Keputusan Klaim' },
];

// Transaction Types
export const TRANSACTION_TYPES = {
    BBM: 'bbm',
    E_VOUCHER: 'e-voucher',
    LPG: 'lpg',
    SPKLU: 'spklu',
    OTHER: 'lainnya',
};

// Product Types for filtering
export const PRODUCT_FILTERS = [
    { id: 'bbm', label: 'BBM' },
    { id: 'e-voucher', label: 'E-Voucher' },
    { id: 'lpg', label: 'LPG' },
    { id: 'spklu', label: 'SPKLU' },
    { id: 'lainnya', label: 'Lainnya' },
];

// Coverage Information
export const COVERAGE_INFO = {
    title: 'Apa yang Dijamin?',
    items: [
        'Kerusakan mesin akibat kualitas BBM',
        'Penurunan performa kendaraan setelah pengisian',
        'Biaya perbaikan kendaraan (sesuai hasil investigasi)',
        'Kompensasi sesuai hasil investigasi',
    ]
};

// Example Cases
export const EXAMPLE_CASES = [
    {
        title: 'Mesin Brebet Setelah Pengisian',
        description: 'Mesin terasa tidak stabil atau brebet segera setelah mengisi BBM di SPBU'
    },
    {
        title: 'Suara Mesin Tidak Normal',
        description: 'Mesin mengeluarkan suara knocking atau tidak biasa setelah pengisian'
    },
    {
        title: 'Performa Kendaraan Menurun',
        description: 'Kendaraan terasa lebih boros atau tenaga berkurang drastis setelah pengisian'
    },
];
