import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const COLORS = {
  primary: "#380ABB",
  dark: "#262742",
  secondary: "#3A3B65",
  pink: "#E5DEFB",
};

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      fontFamily: {
        poppins: ["var(--font-poppins)"],
        lato: ["var(--font-lato)"],
      },
    },
    colors: {
      ...colors,
      ...COLORS,
    },
  },
  plugins: [],
};
export default config;
