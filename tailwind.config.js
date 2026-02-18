/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)', // Deep Void - Main Background
                    light: 'var(--color-primary-light)',   // Slate 900 - Fallback/Cards
                    dark: 'var(--color-primary-dark)',    // Pure Black
                },
                accent: {
                    DEFAULT: 'var(--color-accent)', // Electric Violet
                    hover: 'var(--color-accent-hover)',
                    glow: 'var(--color-accent-glow)',    // Lighter Violet
                    cyan: 'var(--color-accent-cyan)',    // Cyan - Secondary Accent
                },
                surface: {
                    100: 'var(--color-surface-100)', // Glass Low
                    200: 'var(--color-surface-200)', // Glass Medium
                    300: 'var(--color-surface-300)', // Glass High
                },
                highlight: {
                    DEFAULT: 'var(--color-highlight)', // Cyan
                    error: 'var(--color-highlight-error)',   // Red
                },
                neutral: {
                    50: 'var(--color-neutral-50)',
                    100: 'var(--color-neutral-100)',
                    200: 'var(--color-neutral-200)', // Cool Gray
                    300: 'var(--color-neutral-300)',
                    400: 'var(--color-neutral-400)',
                    500: 'var(--color-neutral-500)', // Added intermediate gray
                    800: 'var(--color-neutral-800)', // Added dark gray for light mode text
                    900: 'var(--color-neutral-900)', // Added darker gray
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
