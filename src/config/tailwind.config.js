/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      /* ─── Colours ────────────────────────────────────────────── */
      colors: {
        brand: {
          50:  'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        neutral: {
          0:   'var(--color-neutral-0)',
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
        },
        success: {
          light:   'var(--color-success-light)',
          DEFAULT: 'var(--color-success)',
          dark:    'var(--color-success-dark)',
        },
        warning: {
          light:   'var(--color-warning-light)',
          DEFAULT: 'var(--color-warning)',
          dark:    'var(--color-warning-dark)',
        },
        error: {
          light:   'var(--color-error-light)',
          DEFAULT: 'var(--color-error)',
          dark:    'var(--color-error-dark)',
        },
        info: {
          light:   'var(--color-info-light)',
          DEFAULT: 'var(--color-info)',
          dark:    'var(--color-info-dark)',
        },
        bg: {
          page:    'var(--color-bg-page)',
          surface: 'var(--color-bg-surface)',
          subtle:  'var(--color-bg-subtle)',
          overlay: 'var(--color-bg-overlay)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary:  'var(--color-text-tertiary)',
          disabled:  'var(--color-text-disabled)',
          inverse:   'var(--color-text-inverse)',
          link:      'var(--color-text-link)',
          'link-hover': 'var(--color-text-link-hover)',
        },
        border: {
          default: 'var(--color-border-default)',
          strong:  'var(--color-border-strong)',
          focus:   'var(--color-border-focus)',
        },
      },

      /* ─── Spacing ────────────────────────────────────────────── */
      spacing: {
        '0.5': 'var(--spacing-0-5)',
        '1':   'var(--spacing-1)',
        '1.5': 'var(--spacing-1-5)',
        '2':   'var(--spacing-2)',
        '2.5': 'var(--spacing-2-5)',
        '3':   'var(--spacing-3)',
        '3.5': 'var(--spacing-3-5)',
        '4':   'var(--spacing-4)',
        '5':   'var(--spacing-5)',
        '6':   'var(--spacing-6)',
        '7':   'var(--spacing-7)',
        '8':   'var(--spacing-8)',
        '9':   'var(--spacing-9)',
        '10':  'var(--spacing-10)',
        '11':  'var(--spacing-11)',
        '12':  'var(--spacing-12)',
        '14':  'var(--spacing-14)',
        '16':  'var(--spacing-16)',
        '20':  'var(--spacing-20)',
        '24':  'var(--spacing-24)',
        '28':  'var(--spacing-28)',
        '32':  'var(--spacing-32)',
        '36':  'var(--spacing-36)',
        '40':  'var(--spacing-40)',
        '44':  'var(--spacing-44)',
        '48':  'var(--spacing-48)',
        '56':  'var(--spacing-56)',
        '64':  'var(--spacing-64)',
        '72':  'var(--spacing-72)',
        '80':  'var(--spacing-80)',
        '96':  'var(--spacing-96)',
      },

      /* ─── Border Radius ──────────────────────────────────────── */
      borderRadius: {
        none:    'var(--radius-none)',
        sm:      'var(--radius-sm)',
        DEFAULT: 'var(--radius-default)',
        md:      'var(--radius-md)',
        lg:      'var(--radius-lg)',
        xl:      'var(--radius-xl)',
        '2xl':   'var(--radius-2xl)',
        '3xl':   'var(--radius-3xl)',
        full:    'var(--radius-full)',
      },

      /* ─── Box Shadow ─────────────────────────────────────────── */
      boxShadow: {
        none:  'var(--shadow-none)',
        xs:    'var(--shadow-xs)',
        sm:    'var(--shadow-sm)',
        DEFAULT:'var(--shadow-md)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        xl:    'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
      },

      /* ─── Font Family ────────────────────────────────────────── */
      fontFamily: {
        sans: 'var(--font-family-sans)',
        mono: 'var(--font-family-mono)',
      },

      /* ─── Font Size ──────────────────────────────────────────── */
      fontSize: {
        xs:   ['var(--font-size-xs)',   { lineHeight: 'var(--line-height-normal)' }],
        sm:   ['var(--font-size-sm)',   { lineHeight: 'var(--line-height-normal)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
        lg:   ['var(--font-size-lg)',   { lineHeight: 'var(--line-height-relaxed)' }],
        xl:   ['var(--font-size-xl)',   { lineHeight: 'var(--line-height-snug)' }],
        '2xl':['var(--font-size-2xl)', { lineHeight: 'var(--line-height-snug)' }],
        '3xl':['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl':['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        '5xl':['var(--font-size-5xl)', { lineHeight: 'var(--line-height-none)' }],
      },

      /* ─── Font Weight ────────────────────────────────────────── */
      fontWeight: {
        normal:    'var(--font-weight-normal)',
        medium:    'var(--font-weight-medium)',
        semibold:  'var(--font-weight-semibold)',
        bold:      'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
      },

      /* ─── Transition Duration ────────────────────────────────── */
      transitionDuration: {
        fast:   'var(--transition-duration-fast)',
        normal: 'var(--transition-duration-normal)',
        slow:   'var(--transition-duration-slow)',
      },

      /* ─── Z-Index ────────────────────────────────────────────── */
      zIndex: {
        base:     'var(--z-index-base)',
        raised:   'var(--z-index-raised)',
        dropdown: 'var(--z-index-dropdown)',
        sticky:   'var(--z-index-sticky)',
        overlay:  'var(--z-index-overlay)',
        modal:    'var(--z-index-modal)',
        toast:    'var(--z-index-toast)',
        tooltip:  'var(--z-index-tooltip)',
      },
    },
  },

  plugins: [],
};

export default tailwindConfig;
