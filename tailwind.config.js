/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    bg: '#050510',
                    glass: 'rgba(20, 20, 40, 0.6)',
                    neonBlue: '#00f3ff',
                    neonPink: '#ff00ff',
                    neonGreen: '#00ff9d',
                }
            },
            boxShadow: {
                'neon-blue': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
                'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff',
            }
        },
    },
    plugins: [],
}
