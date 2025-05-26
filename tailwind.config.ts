import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: '#FFD600', // 新主色
          light: '#FFD600',   // 同主色
          dark: '#FFD600',    // 同主色
          foreground: '#000000' // 黑色文本
        },
        qxnet: {
          DEFAULT: '#FFD600', // 新主色
          '50': '#FFF9E0',    // 亮黄
          '100': '#FFF4B3',   // 亮黄
          '200': '#FFE066',   // 中亮黄
          '300': '#FFD600',   // 主色
          '400': '#FFD600',   // 主色
          '500': '#FFD600',   // 主色
          '600': '#FFD600',   // 主色
          '700': '#FFD600',   // 主色
          '800': '#FFD600',   // 主色
          '900': '#FFD600',   // 主色
          '950': '#FFD600',   // 主色
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': '#E4BF2D', // QX Net gold
          '2': '#C4A31D', // Dark gold
          '3': '#A38918', // Darker gold
          '4': '#F0D46F', // Light gold
          '5': '#F7ECC1'  // Very light gold
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #E4BF2D, #F0D46F)',
        'gold-gradient-vertical': 'linear-gradient(to bottom, #E4BF2D, #F0D46F)',
        'gold-gradient-diagonal': 'linear-gradient(135deg, #E4BF2D, #F0D46F)',
        'gold-gradient-radial': 'radial-gradient(#F0D46F, #E4BF2D)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-slow": "bounce-slow 3s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;

export default config;
