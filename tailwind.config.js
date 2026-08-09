/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b6e5d",
        "primary-dark": "#084f42",
        "primary-light": "#e3f3ef",
        accent: "#f0a202",
        background: "#f5faf9",
        surface: "#ffffff",
        ink: "#12302b",
        muted: "#5b7770",
        border: "#e1ede9",
      },
      fontFamily: {
        display: ["Sora", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        brand: "14px",
        "brand-sm": "8px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(11, 110, 93, 0.08)",
        md: "0 10px 30px rgba(11, 110, 93, 0.12)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease",
        slideUp: "slideUp 0.25s ease",
      },
    },
  },
  plugins: [],
}