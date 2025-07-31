/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'warm': '#FCFAF7',
        'primary-teal': '#1F6F78',
        'accent-mango': '#FFC266',
        'accent-mist': '#E6F0F2',
        'charcoal': '#2B2B2B',
        'focus-blue': '#0B63A3'
      },
      fontFamily: {
        'heading': ['Nunito', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'dyslexic': ['OpenDyslexic', 'sans-serif']
      },
      spacing: {
        'grid': '8px'
      },
      maxWidth: {
        'content': '1120px'
      },
      borderRadius: {
        'card': '16px'
      },
      boxShadow: {
        'gentle': '0 2px 8px rgba(0, 0, 0, 0.08)'
      },
      transitionDuration: {
        'gentle': '150ms'
      },
      scale: {
        'hover': '1.02'
      }
    },
  },
  plugins: [],
}