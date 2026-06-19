/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fc',
        foreground: '#0f172a',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        popover: '#ffffff',
        'popover-foreground': '#0f172a',
        primary: '#0f172a',
        'primary-foreground': '#f8fafc',
        secondary: '#f8fafc',
        'secondary-foreground': '#0f172a',
        muted: '#f8fafc',
        'muted-foreground': '#64748b',
        accent: '#eff6ff',
        'accent-foreground': '#0f172a',
        destructive: '#dc2626',
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#94a3b8'
      },
      borderRadius: {
        lg: '0.625rem'
      }
    },
  },
  plugins: [],
}

