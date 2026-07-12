/** Design tokens derived from the TransitOps mockups: near-black surfaces,
 *  an amber primary accent, and status colours used consistently everywhere. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0b', // app background
          900: '#111114', // panels
          850: '#16161a', // raised panels / rows
          800: '#1d1d22', // inputs
          700: '#2a2a31', // borders
          600: '#3a3a42',
        },
        primary: {
          DEFAULT: '#E5850B', // amber accent (buttons, active nav)
          hover: '#c9740a',
          soft: 'rgba(229,133,11,0.12)',
        },
        status: {
          available: '#22c55e',
          ontrip: '#3b82f6',
          inshop: '#f97316',
          retired: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
