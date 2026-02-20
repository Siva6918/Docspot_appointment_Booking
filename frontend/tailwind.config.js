/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Strict Red & White Palette
                brand: {
                    red: '#DC2626',      // Main Brand Red
                    dark: '#991B1B',     // Dark Red (Text, Headings)
                    light: '#FCA5A5',    // Light Red (Accents)
                    soft: '#FEE2E2',     // Soft Red (Backgrounds)
                    white: '#FFFFFF',    // White
                    offWhite: '#FFF5F5', // Off White
                },
                // Mapping old meta colors to new strict palette to prevent breakage, 
                // but enforcing the new look.
                meta: {
                    neon: '#DC2626',     // Mapped to Brand Red
                    violet: '#991B1B',   // Mapped to Dark Red
                    pink: '#FCA5A5',     // Mapped to Light Red
                    wine: '#991B1B',     // Mapped to Dark Red
                    dark: '#FFFFFF',     // Forced White
                    deep: '#FFF5F5',     // Forced Off-White
                },
                // Overriding defaults to prevent accidental grays/blacks
                gray: {
                    50: '#FFFFFF',
                    100: '#FFF5F5',      // Off White
                    200: '#FEE2E2',      // Soft Red
                    300: '#FCA5A5',      // Light Red
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',      // Brand Red
                    700: '#B91C1C',
                    800: '#991B1B',      // Dark Red
                    900: '#7F1D1D',      // Deepest Red
                }
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(220, 38, 38, 0.3)',
                'glow-soft': '0 4px 20px rgba(220, 38, 38, 0.1)',
                'glass': '0 8px 32px 0 rgba(153, 27, 27, 0.05)',
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
                'red-gradient': 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            }
        },
    },
    plugins: [],
}
