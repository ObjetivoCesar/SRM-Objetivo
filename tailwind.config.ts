import type { Config } from "tailwindcss";

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f5f3',
        foreground: '#2d3436',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2d3436'
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#2d3436'
        },
        primary: {
          DEFAULT: '#ff6b35',
          foreground: '#ffffff' // White text on orange should be fine
        },
        secondary: {
          DEFAULT: '#ffd23f',
          foreground: '#2d3436' // Dark text on yellow is more readable
        },
        muted: {
          DEFAULT: '#f7f5f3',
          foreground: '#b2bec3'
        },
        accent: {
          DEFAULT: '#ffeb3b',
          foreground: '#2d3436' // Dark text on light yellow
        },
        destructive: {
          DEFAULT: '#ff8f00',
          foreground: '#ffffff'
        },
        border: '#b2bec3',
        input: '#b2bec3',
        ring: '#ff6b35',
        sidebar: {
          DEFAULT: '#ffffff',
          foreground: '#2d3436',
          border: '#b2bec3',
          accent: '#ff6b35',
          'accent-foreground': '#ffffff',
          ring: '#ff6b35'
        }
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
        xl: '20px',
        full: '50%'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #ff6b35 0%, #ff8f00 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #ffd23f 0%, #ffeb3b 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'slide-in-right': {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-out-left': {
          from: {
            transform: 'translateX(0)',
            opacity: '1',
          },
          to: {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pop-in': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-out-left': 'slide-out-left 0.4s ease-in',
        'spin': 'spin 1s linear infinite',
        'pop-in': 'pop-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
