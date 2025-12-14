import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class", ".dark"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    patterns: {
      opacities: {
        100: "1",
        80: "0.8",
        60: "0.6",
        40: "0.4",
        20: "0.2",
        10: "0.1",
        5: "0.05",
      },
      sizes: {
        1: "0.25rem",
        2: "0.5rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      },
    },
    extend: {
      animation: {},
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        base: {
          pale: "hsl(var(--base-pale))",
        },
        contrast: {
          DEFAULT: "hsl(var(--contrast))",
          pale: "hsl(var(--contrast-pale))",
        },
        brand: {
          deep: "hsl(var(--accent-deep))",
          base: "hsl(var(--accent-base))",
          pale: "hsl(var(--accent-pale))",
          paleDeep: "hsl(var(--accent-pale-deep))",
        },
        gray: {
          dark: "hsl(var(--dark-grey))",
        },
        subtle: {
          pale: "hsl(var(--subtle-pale))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          pale: "hsl(var(--error-pale))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          pale: "hsl(var(--warning-pale))",
        },
        sidebar: "var(--sidebar)",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
