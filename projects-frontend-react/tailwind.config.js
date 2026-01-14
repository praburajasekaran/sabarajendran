/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Headlines: Bold, Impactful
                sans: ['Anek Tamil', 'sans-serif'],
                display: ['Anek Tamil', 'sans-serif'],
                serif: ['Anek Tamil', 'sans-serif'], // Force serif to sans for political consistency
                // Data/Numbers: Mono for alignment
                mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
            },
            fontSize: {
                // Display (Hero headlines)
                'display-lg': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '800' }],
                'display-md': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '800' }],
                // Headings
                'h1': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
                'h2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
                'h3': ['1.75rem', { lineHeight: '1.25', letterSpacing: '0', fontWeight: '600' }],
                // Body
                'body-lg': ['1.25rem', { lineHeight: '1.6', fontWeight: '500' }],
                'body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
                'body-sm': ['1rem', { lineHeight: '1.5' }],
                // Data (mono)
                'data-lg': ['2.5rem', { lineHeight: '1', fontWeight: '700' }],
                'data': ['1.5rem', { lineHeight: '1.2' }],
            },
            colors: {
                // Primary: DMK Red (Energetic, Powerful)
                primary: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#dc2626', // Base Red
                    600: '#b91c1c',
                    700: '#991b1b', // Darker Red for text/contrast
                    800: '#7f1d1d',
                    900: '#450a0a',
                },
                // Secondary: Black (Solid, Grounding)
                secondary: {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#262626', // Off Black
                    900: '#000000', // Pure Black
                },
                // Accent: Lignite Brown (Neyveli's natural resource - represents local coal mining heritage)
                accent: {
                    50: '#efebe9',
                    100: '#E8D5C4', // Lighter beige-brown - excellent on dark backgrounds
                    200: '#D4A574', // Light golden brown - great on dark backgrounds
                    300: '#C0956A',
                    400: '#B4915D', // Lighter medium brown - good visibility on dark BG
                    500: '#8B6F47', // Lighter brown - replaces old dark brown
                    600: '#6d4c41', // Medium brown
                    700: '#3e2723', // Original dark brown - use on light backgrounds only
                    800: '#2b1a15',
                    900: '#1b0000',
                },
                // Neutral: Cool Grays to support the warm palette
                neutral: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                }
            }
        },
    },
    plugins: [],
}
