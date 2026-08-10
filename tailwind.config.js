/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "cols-2": "481px",
        "cols-3": "761px",
        "cols-4": "1081px",
      },
      colors: {
        primary: {
          DEFAULT: "#0b6e5d",
          dark: "#084f42",
          light: "#e3f3ef",
        },
        accent: "#f0a202",
        surface: "#ffffff",
        page: "#f5faf9",
        ink: "#12302b",
        muted: "#5b7770",
        line: "#e1ede9",
        danger: "#c0392b",
        success: "#1e7d4b",
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
        "brand-sm": "0 1px 3px rgba(11, 110, 93, 0.08)",
        "brand-md": "0 10px 30px rgba(11, 110, 93, 0.12)",
        sidebar: "-12px 0 30px rgba(11, 110, 93, 0.15)",
      },
      backgroundImage: {
        dots: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        "placeholder-gradient":
          "linear-gradient(135deg, #e3f3ef, #d5efe8)",
      },
      backgroundSize: {
        dots: "18px 18px",
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
};
