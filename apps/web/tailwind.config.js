/** @type {import('tailwindcss').Config} */
export default {
    content: ['./apps/web/index.html', './apps/web/src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#F6FBF8',
                    100: '#EAF4EF',
                    200: '#D9ECE4',
                    300: '#A7D7C5',
                    400: '#7FB8A6',
                },
                blush: {
                    100: '#FCE1E7',
                    200: '#F9C6D1',
                    300: '#F5B4C3',
                    400: '#F2A1B3',
                    500: '#E97F97',
                },

                // semantic tokens
                surface: '#F6FBF8',
                primary: '#7FB8A6',
                primarySoft: '#A7D7C5',
                accent: '#F2A1B3',
            },
            fontFamily: {
                nanum: ['"Nanum Pen Script"', 'cursive'],
                jua: ['Jua', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
