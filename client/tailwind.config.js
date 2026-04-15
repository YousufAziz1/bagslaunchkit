/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        base: '#0A0A0F',
        surface: '#111827',
        elevated: '#1a2035',
        accent: '#7C3AED',
        'accent-light': '#9D6EFC',
        'accent-glow': 'rgba(124,58,237,0.3)',
        success: '#10B981',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        border: '#1F2937',
        'border-active': 'rgba(124,58,237,0.5)',
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.6s cubic-bezier(0.4,0,0.2,1) both',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
        'orb-float': 'orbFloat 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'border-spin': 'borderSpin 3s linear infinite',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: 0, transform: 'translateY(28px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.7 },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-40px) scale(1.05)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.95)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.7), 0 0 60px rgba(124,58,237,0.3)' },
        },
        borderSpin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
