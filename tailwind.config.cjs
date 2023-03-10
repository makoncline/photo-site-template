// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          1: colors.slate[900],
          2: colors.slate[800],
          3: colors.slate[700],
          4: colors.slate[600],
        },
        text: {
          1: colors.slate[200],
          2: colors.slate[300],
        },
        brand: {
          0: colors.blue[400],
          1: colors.blue[500],
          2: colors.blue[600],
        },
        glint: colors.white,
        hairline: colors.slate[500],
      },
    },
  },
  plugins: [],
};

module.exports = config;
