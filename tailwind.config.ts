import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      // Tighter on phones, roomier on wide screens, instead of a flat 2rem.
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Bungee was listed but never loaded, so it only ever added a failed
        // lookup before falling through to cursive.
        //
        // display: the CoC brand face. Reserved for the hero headline and
        // other single largest-on-the-page brand moments - it no longer
        // carries every section title.
        display: ["Supercell-Magic", "Lilita One", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "-apple-system", "sans-serif"],
        coc: ["Supercell-Magic", "Lilita One", "system-ui", "sans-serif"],
        // heading: geometric modern sans for section titles ("Sponsors",
        // "The Treasury", "The War Map"...). The contrast against the
        // playful display face is what reads as premium rather than heavy.
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        // handwritten: casual marker face for small pinned captions next to
        // character art only - not a heading or body substitute.
        handwritten: ["Caveat", "cursive"],
      },
      // Fluid display sizes so headings interpolate across breakpoints
      // rather than jumping between fixed steps.
      fontSize: {
        "fluid-sm": ["clamp(0.875rem, 0.83rem + 0.22vw, 1rem)", { lineHeight: "1.55" }],
        "fluid-base": ["clamp(1rem, 0.95rem + 0.25vw, 1.125rem)", { lineHeight: "1.65" }],
        "fluid-lg": ["clamp(1.125rem, 1.03rem + 0.45vw, 1.375rem)", { lineHeight: "1.5" }],
        "fluid-xl": ["clamp(1.375rem, 1.2rem + 0.85vw, 1.875rem)", { lineHeight: "1.3" }],
        "fluid-2xl": ["clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)", { lineHeight: "1.18" }],
        "fluid-3xl": ["clamp(2.25rem, 1.7rem + 2.6vw, 4rem)", { lineHeight: "1.1" }],
        "fluid-4xl": ["clamp(2.75rem, 1.9rem + 4vw, 5.5rem)", { lineHeight: "1.05" }],
      },
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
        // Clash of Clans brand colours
        "elixir-pink": "hsl(var(--elixir-pink))",
        "gold-coin": "hsl(var(--gold-coin))",
        "gem-green": "hsl(var(--gem-green))",
        "dark-elixir": "hsl(var(--dark-elixir))",
        "wall-stone": "hsl(var(--wall-stone))",
        "grass-green": "hsl(var(--grass-green))",
        "wood-brown": "hsl(var(--wood-brown))",
        parchment: "hsl(var(--parchment))",
        "sky-blue": "hsl(var(--sky-blue))",
        "fire-orange": "hsl(var(--fire-orange))",
        "lightning-blue": "hsl(var(--lightning-blue))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "elev-1": "var(--elev-1)",
        "elev-2": "var(--elev-2)",
        "elev-3": "var(--elev-3)",
        "elev-4": "var(--elev-4)",
        "glow-gold": "var(--glow-gold)",
        "glow-elixir": "var(--glow-elixir)",
        "glow-gem": "var(--glow-gem)",
        "glow-purple": "var(--glow-purple)",
      },
      transitionTimingFunction: {
        "out-expo": "var(--ease-out)",
        "in-out-soft": "var(--ease-in-out)",
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translate3d(0, 18px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.22s var(--ease-out)",
        "accordion-up": "accordion-up 0.22s var(--ease-out)",
        "fade-up": "fade-up 0.5s var(--ease-out) forwards",
        "bounce-slow": "bounce-slow 2.6s var(--ease-in-out) infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      backgroundImage: {
        "grass-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d5a27' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        "stone-texture":
          "linear-gradient(135deg, hsl(28 10% 30%) 0%, hsl(28 12% 18%) 50%, hsl(28 10% 24%) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
