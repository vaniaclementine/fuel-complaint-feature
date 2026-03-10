/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    red: '#ED1B24',
                    blue: '#1B4E9B', // MyPertamina brand blue
                    green: '#5CB85C',
                    green95: '#00A651', // PG95 brand green
                },
                neutral: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                status: {
                    received: '#EFF6FF', // Softer light blue bg
                    receivedText: '#1B4E9B',
                    process: '#FFF7ED', // Softer light orange bg
                    processText: '#EA580C',
                    done: '#F0FDF4', // Softer light green bg
                    doneText: '#16A34A',
                    rejected: '#FEF2F2', // Softer light red bg
                    rejectedText: '#DC2626',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
