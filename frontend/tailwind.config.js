/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d',950:'#052e16' },
        earth: { 50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12' },
      },
      fontFamily: { sans:['Inter','system-ui','sans-serif'], display:['Lexend','Inter','system-ui','sans-serif'] },
      animation: { 'fade-in':'fadeIn 0.6s ease-out forwards','slide-up':'slideUp 0.6s ease-out forwards','float':'float 6s ease-in-out infinite','pulse-slow':'pulse 3s ease-in-out infinite' },
      keyframes: {
        fadeIn:{ from:{opacity:0},to:{opacity:1} },
        slideUp:{ from:{opacity:0,transform:'translateY(24px)'},to:{opacity:1,transform:'translateY(0)'} },
        float:{ '0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-12px)'} },
      },
    },
  },
  plugins: [],
}
