/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#363dc2',
        secondary: '#282faf',
        tertiary: '#202692',
        accent: '#03b9f1',
      },
      fontFamily: {
        'nexa': ['nexa_boldregular', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            backgroundSize: '200% 200%',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
          },
        },
        'blob': {
          '0%, 100%': { 
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': { 
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': { 
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
        'float': {
          '0%, 100%': { 
            transform: 'translateY(0px)',
          },
          '50%': { 
            transform: 'translateY(-20px)',
          },
        },
      },
    },
  },
  plugins: [],
}
