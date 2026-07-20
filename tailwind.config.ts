import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    // Perfect-fourth (1.333) scale, editorial-optimized line heights.
    fontSize: {
      caption: ['0.75rem', { lineHeight: '1.1rem', letterSpacing: '0.08em' }],
      xs: ['0.8125rem', { lineHeight: '1.35rem' }],
      sm: ['0.9375rem', { lineHeight: '1.55rem' }],
      base: ['1.0625rem', { lineHeight: '1.7rem' }],
      lg: ['1.25rem', { lineHeight: '1.85rem' }],
      xl: ['1.563rem', { lineHeight: '2.05rem' }],
      '2xl': ['1.953rem', { lineHeight: '2.35rem' }],
      '3xl': ['2.441rem', { lineHeight: '2.6rem' }],
      '4xl': ['3.052rem', { lineHeight: '1.08' }],
      '5xl': ['3.815rem', { lineHeight: '1.02' }],
      '6xl': ['4.768rem', { lineHeight: '0.96' }],
      '7xl': ['5.96rem', { lineHeight: '0.94' }],
      '8xl': ['7.45rem', { lineHeight: '0.9' }],
    },
    container: {
      center: true,
      // Base gutter. Wider screens get more via the md/lg/xl px utilities added
      // to `.container` usages (the container's own responsive padding is
      // coupled to `screens` below, so utilities are the reliable lever).
      padding: "1.5rem",
      screens: {
        "2xl": "1600px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader"', 'Iowan Old Style', 'Georgia', 'serif'],
        display: ['"Newsreader"', 'Iowan Old Style', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '38': '9.5rem',
        '46': '11.5rem',
        gutter: '2.5rem',
        masthead: '4.25rem',
      },
      maxWidth: {
        prose: '65ch',
        measure: '54ch',
        spread: '88rem',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Editorial tokens (paper / ink / brand)
        paper: {
          DEFAULT: "hsl(var(--paper))",
          deep: "hsl(var(--paper-deep))",
          tinted: "hsl(var(--paper-tinted))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          soft: "hsl(var(--ink-soft))",
          faint: "hsl(var(--ink-faint))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          soft: "hsl(var(--navy-soft))",
        },
        "accent-tinted": "hsl(var(--accent-tinted))",
        "accent-surface": "hsl(var(--accent-surface))",
        "accent-text": "hsl(var(--accent-text))",
        "on-navy": "hsl(var(--on-navy))",
        aqua: "hsl(var(--aqua))",
        ochre: "hsl(var(--ochre))",
        // shadcn semantic
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderColor: {
        hairline: "hsl(var(--ink) / 0.12)",
        "hairline-strong": "hsl(var(--ink) / 0.24)",
        rule: "hsl(var(--rule))",
      },
      borderWidth: {
        hairline: '0.5px',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.125rem',
        md: '0.25rem',
        lg: 'var(--radius)',
        xl: '0.375rem',
        full: '9999px',
      },
      boxShadow: {
        hairline: '0 0 0 0.5px hsl(var(--ink) / 0.16)',
        press: '0 1px 0 0 hsl(var(--ink) / 0.18)',
        none: 'none',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
        stately: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        quick: '220ms',
        normal: '420ms',
        slow: '720ms',
        reveal: '900ms',
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.6s ease-out forwards",
        marquee: "marquee var(--duration, 40s) linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
