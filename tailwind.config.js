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
          DEFAULT: "#006e85",
          dark: "#004f5f",
          light: "#e0eef1",
        },
        accent: "#e50020",
        star: "#f5a623",
        surface: "#ffffff",
        page: "#f4f8f9",
        ink: "#20302f",
        muted: "#6d757d",
        line: "#dde7e8",
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
        "brand-sm": "0 1px 3px rgba(0, 110, 133, 0.08)",
        "brand-md": "0 10px 30px rgba(0, 110, 133, 0.12)",
        sidebar: "-12px 0 30px rgba(0, 110, 133, 0.15)",
      },
      backgroundImage: {
        dots: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        "placeholder-gradient":
          "linear-gradient(135deg, #e0eef1, #d0e5e8)",
        "header-glow":
          "radial-gradient(120% 180% at 15% 0%, rgba(229,0,32,0.35) 0%, transparent 55%), linear-gradient(120deg, #008ba6 0%, #006e85 45%, #004f5f 100%)",
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
        pulseRing: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(229,0,32,0.45)" },
          "50%": { boxShadow: "0 0 0 6px rgba(229,0,32,0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease",
        slideUp: "slideUp 0.25s ease",
        pulseRing: "pulseRing 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
