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
                    DEFAULT: '#030014', // Deep Void - Main Background
                    light: '#0f172a',   // Slate 900 - Fallback/Cards
                    dark: '#000000',    // Pure Black
                },
                accent: {
                    DEFAULT: '#7000FF', // Electric Violet
                    hover: '#5e00d6',
                    glow: '#B066FF',    // Lighter Violet
                    cyan: '#00C2FF',    // Cyan - Secondary Accent
                },
                surface: {
                    100: 'rgba(255, 255, 255, 0.03)', // Glass Low
                    200: 'rgba(255, 255, 255, 0.07)', // Glass Medium
                    300: 'rgba(255, 255, 255, 0.12)', // Glass High
                },
                highlight: {
                    DEFAULT: '#00C2FF', // Cyan
                    error: '#ef4444',   // Red
                },
                neutral: {
                    50: '#ffffff',
                    100: '#f8fafc',
                    200: '#cbd5e1', // Cool Gray
                    300: '#94a3b8',
                    400: '#64748b',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
            },
            animation: {
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
