/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06262C",
        brand: { DEFAULT: "#0BB8D3", deep: "#087E90" },
        line: "#DCE9EC",
        mist: "#F2F8F9",
      },
      fontFamily: {
        sans: ['"Geist"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
        display: ['"Unbounded"', '"Geist"', "sans-serif"],
      },
    },
  },
  plugins: [],
}
