/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #1E2B1E)',
          light: 'var(--color-primary-light, #2A3B2A)',
          dark: 'var(--color-primary-dark, #121B12)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #78AC77)',
          light: 'var(--color-secondary-light, #8FBE8E)',
          dark: 'var(--color-secondary-dark, #619A60)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #759186)',
          light: 'var(--color-accent-light, #8A9E97)',
          dark: 'var(--color-accent-dark, #5F7670)',
        },
        action: {
          DEFAULT: 'var(--color-action, #FFFF47)',
          light: 'var(--color-action-light, #FFFF7A)',
          dark: 'var(--color-action-dark, #CCCC14)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading, "Poppins")', 'sans-serif'],
        body: ['var(--font-body, "Montserrat")', 'sans-serif'],
      },
      spacing: {
        section: 'var(--section-spacing, 8rem)',
        component: 'var(--component-spacing, 4rem)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 