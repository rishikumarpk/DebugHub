/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Metallic Black Palette
                metallic: {
                    900: '#000000',
                    800: '#030303',
                    700: '#2E2E2E',
                    600: '#414141',
                    500: '#434343',
                    400: '#494949',
                    300: '#616161',
                    200: '#626262',
                    100: '#898989',
                    50: '#8B8B8B',
                },
                // Mapping the old primary colors to the new palette to preserve class names
                primary: '#616161',
                secondary: '#898989',
                accent: '#8B8B8B',
                background: '#000000',
                surface: '#030303',
                muted: '#494949',
                card: '#030303',
                border: '#434343',
            }
        },
    },
    plugins: [],
}
