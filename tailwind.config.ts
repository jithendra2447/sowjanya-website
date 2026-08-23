import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border, 240 5.9% 90%))",
        input: "hsl(var(--input, 240 5.9% 90%))",
        ring: "hsl(var(--ring, 240 5.9% 10%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 240 10% 3.9%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 240 5.9% 10%))",
          foreground: "hsl(var(--primary-foreground, 0 0% 98%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 240 4.8% 95.9%))",
          foreground: "hsl(var(--secondary-foreground, 240 5.9% 10%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84.2% 60.2%))",
          foreground: "hsl(var(--destructive-foreground, 0 0% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 240 4.8% 95.9%))",
          foreground: "hsl(var(--muted-foreground, 240 3.8% 46.1%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 240 4.8% 95.9%))",
          foreground: "hsl(var(--accent-foreground, 240 5.9% 10%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 0 0% 100%))",
          foreground: "hsl(var(--popover-foreground, 240 10% 3.9%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%))",
          foreground: "hsl(var(--card-foreground, 240 10% 3.9%))",
        },
        brand: {
          "pastel-pink": "#F8BBD0",
          "pastel-lavender": "#E1BEE7",
          "pastel-violet": "#D1C4E9",
          "pastel-blue": "#BBDEFB",
          "pastel-cyan": "#B2EBF2",
          maroon: "#4A0E17",
          dark: "#2D1C3D",
        }
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "'Outfit'", "'Inter'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      boxShadow: {
        "neuo-flat": "6px 6px 12px rgba(163, 177, 198, 0.35), -6px -6px 12px rgba(255, 255, 255, 0.8)",
        "neuo-inset": "inset 6px 6px 12px rgba(163, 177, 198, 0.35), inset -6px -6px 12px rgba(255, 255, 255, 0.8)",
        "neuo-btn": "4px 4px 8px rgba(163, 177, 198, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.75)",
        "neuo-card": "8px 8px 16px rgba(163, 177, 198, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.85)",
      },
    },
  },
  plugins: [],
} satisfies Config;
