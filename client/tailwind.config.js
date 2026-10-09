/** @type {import('tailwindcss').Config} */
//
// ── DESIGN SYSTEM · Nova Conexão ────────────────────────────────
// Fonte única de verdade para cor, raio, sombra, tipografia e
// espaçamento. Não espalhe valores literais pelos componentes.
//
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Superfícies (fundo contínuo, variações sutis) ──
        bg: {
          DEFAULT: "#070D18", // fundo principal da página
          soft: "#0B1322" // variação sutil para faixas
        },
        surface: {
          DEFAULT: "#111A2A", // cartões e painéis
          hi: "#16202F" // hover / camada acima
        },
        line: {
          DEFAULT: "rgba(255,255,255,0.08)", // borda padrão
          strong: "rgba(255,255,255,0.14)" // borda em hover/ativo
        },

        // ── Marca ──
        brand: {
          50: "#ecfbff",
          100: "#d2f4ff",
          200: "#a9ebff",
          300: "#6ddcfb",
          400: "#2ac8f3",
          500: "#08b8ea", // primária
          600: "#159bd3", // secundária / hover
          700: "#1a7ba8",
          800: "#1d6486",
          900: "#1d536f",
          950: "#0d354b"
        },

        // ── Texto ──
        content: {
          DEFAULT: "#F5F7FA", // texto principal
          muted: "#94A3B8", // texto secundário
          faint: "#64748B" // legendas / apoio
        }
      },

      // ── Raio: escala curta e previsível ──
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px", // cartões
        "2xl": "20px", // blocos maiores
        "3xl": "20px" // evita raios exagerados herdados
      },

      // ── Sombra: profundidade, não brilho ──
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.30)",
        sm: "0 2px 6px rgba(0,0,0,0.30)",
        md: "0 6px 20px rgba(0,0,0,0.35)",
        lg: "0 14px 40px rgba(0,0,0,0.40)",
        brand: "0 6px 20px rgba(8,184,234,0.20)"
      },

      // ── Tipografia ──
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      fontSize: {
        // rótulos / eyebrow
        label: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.12em" }],
        small: ["0.8125rem", { lineHeight: "1.25rem" }],
        body: ["0.9375rem", { lineHeight: "1.65" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        h3: ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        h2: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "h2-lg": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h1: ["2.5rem", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "h1-lg": ["4rem", { lineHeight: "1.04", letterSpacing: "-0.035em" }]
      },

      // ── Espaçamento vertical de seção ──
      spacing: {
        "section-sm": "64px",
        section: "80px",
        "section-lg": "96px"
      },

      maxWidth: {
        container: "1200px"
      },

      transitionDuration: {
        DEFAULT: "200ms"
      },

      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.5" },
          "100%": { transform: "scale(2.1)", opacity: "0" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        }
      },
      animation: {
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.4,0,0.2,1) infinite",
        "fade-in": "fade-in 300ms ease-out both"
      }
    }
  },
  plugins: []
};
