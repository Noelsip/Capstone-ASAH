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
          DEFAULT: '#1a73e8',
          hover: '#1557b0',
          dark: '#0d47a1',
        },
        sidebar: '#1E3A8A', 
        
        
        status: {
          critical: '#dc2626',
          warning: '#f59e0b',
          success: '#10b981',
          neutral: '#64748b',
        },
        // Warna untuk dipake di Background App
        bg: {
          main: '#f3f4f6', 
          card: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}