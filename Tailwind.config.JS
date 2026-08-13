/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    // Escala de espaciado propia: generosa, con piso alto para que ningún
    // contenedor "premium" pueda quedar apretado por accidente.
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      32: '128px',
    },
    extend: {
      colors: {
        ivory: '#FAF8F5',
        stone: {
          50: '#FCFBF9',
          100: '#F1EDE7',
          200: '#E6DFD5',
          300: '#DCD4C8',
          400: '#C3B8A8',
        },
        ink: {
          DEFAULT: '#2B2A28',
          muted: '#7A756C',
        },
        // El acento NO se hardcodea a un hex: se resuelve vía variable CSS
        // (seteada por ConfigService según el tenant) para que cada gabinete
        // pueda tener su propio color de marca sin recompilar el build.
        accent: {
          DEFAULT: 'var(--color-accent, #5C6B54)',
          soft: 'var(--color-accent-soft, #E4E9DF)',
          ink: 'var(--color-accent-ink, #3E4A38)',
        },
        state: {
          pending: '#C3B8A8', // borde sutil, sin relleno
          confirmed: 'var(--color-accent, #5C6B54)',
          completed: '#7A756C',
          cancelled: '#B75B4A',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        sm: ['0.875rem', { lineHeight: '1.6' }],
        base: ['1rem', { lineHeight: '1.7' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.5rem', { lineHeight: '1.15' }],
        '5xl': ['3.25rem', { lineHeight: '1.1' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        // Sombras casi imperceptibles: sugieren elevación sin "caja de plástico"
        soft: '0 1px 2px rgba(43, 42, 40, 0.04), 0 8px 24px rgba(43, 42, 40, 0.04)',
        'soft-lg': '0 4px 12px rgba(43, 42, 40, 0.05), 0 16px 40px rgba(43, 42, 40, 0.06)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        250: '250ms',
      },
      letterSpacing: {
        widest: '0.14em',
      },
    },
  },
  plugins: [],
};
