/** @type {import('tailwindcss').Config} */
export default {
  darkMode : "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pops: "Poppins",
      },
      colors: {
          text: "var(--text)",
          background: "var(--background)",
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
      },
    },
  },
  plugins: [],
}

