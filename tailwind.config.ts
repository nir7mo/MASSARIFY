import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f7fbf8",
        brand: {
          50: "#f2fbf5",
          100: "#ddf5e4",
          500: "#2f8f5b",
          600: "#26744a",
          700: "#1d5838"
        }
      },
      boxShadow: {
        card: "0 18px 50px -24px rgba(47, 143, 91, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
