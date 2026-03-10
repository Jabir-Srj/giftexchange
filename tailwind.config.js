/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8e8f0',
          100: '#c5c5d8',
          200: '#9d9dbf',
          300: '#7575a6',
          400: '#565693',
          500: '#373780',
          600: '#2a2a6e',
          700: '#1e1e55',
          800: '#141430',
          900: '#0f0f1a',
          950: '#08080e',
        },
        gold: {
          50:  '#fefaed',
          100: '#fdf3cc',
          200: '#fae99a',
          300: '#f7db68',
          400: '#f5c842',
          500: '#e8b020',
          600: '#c88c0e',
          700: '#9f680c',
          800: '#7a4e10',
          900: '#5e3c10',
        },
        coral: {
          50:  '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9f9f',
          400: '#ff6b6b',
          500: '#f83b3b',
          600: '#e51d1d',
          700: '#c11414',
          800: '#9f1414',
          900: '#841717',
        },
        cream: {
          50:  '#ffffff',
          100: '#fdf6ec',
          200: '#faecd8',
          300: '#f5ddb8',
          400: '#efc890',
          500: '#e5ae66',
          600: '#d4904a',
          700: '#b0723a',
          800: '#8c5a32',
          900: '#714a2b',
        },
        // legacy brand kept for any remaining references
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'mesh-dark': 'radial-gradient(at 20% 20%, #1e1e55 0%, transparent 55%), radial-gradient(at 80% 80%, #2a1a3e 0%, transparent 55%), radial-gradient(at 60% 10%, #1a1a3a 0%, transparent 45%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(245, 200, 66, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(245, 200, 66, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
