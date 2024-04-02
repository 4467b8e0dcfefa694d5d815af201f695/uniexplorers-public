/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', 
    './src/**/*.{vue,js,ts,jsx,tsx}',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
      },
      fontSize : {
        '2xs' : ['0.625rem', '1rem']
      },
      colors: {
        content : '#333333',
        darkgreen: '#1E363E',
        lightgreen: '#DAE3DD',
        lightgreenshadow: '#C4CCC6',
        grey: '#3f3f46',
        lightgrey: '#666666',
        lightergrey : '#F0F0F0',
        white: '#FFFFFF',
        danger : '#F85249',
        dangerActive : '#B62323',
        red: '#D21312',
        darkred: '#AA1312',
        bluepastel: '#9ADCFF',
        greenpastel: '#C9F4AA',
        yellowpastel: '#FDFDBD',
        orange: '#FC513F',
        pumpkin : '#FAA916',
        purple : '#6D466B',
        hotpink : '#DE369D',
        brown : '#634133',
        cyan : '#32A287',
        salmon : '#DF7373',
        indigo : '#8E94F2'
      },
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      caudex: ['Caudex', 'serif'],
      display: ['Gabarito', 'sans-serif']
    },
    screens: {
      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'md': '767px',
      // => @media (min-width: 768px) { ... }

      'lg': '991px',
      // => @media (min-width: 992px) { ... }

      'xl': '1200px',
      // => @media (min-width: 1200px) { ... }

      'xxl': '1400px',
      // => @media (min-width: 1400px) { ... }
    },
    
  },
  plugins: [
    require('flowbite/plugin')
  ],
  safelist: [
    {
      pattern: /text-.+/,
    }
  ]
}
