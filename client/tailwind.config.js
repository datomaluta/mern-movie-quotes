/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "project-red": "#E31221",
        "project-dark-red": "#CC0E10",
        "project-disabled-red": "#EC4C57",
        "project-yellow": "#DDCCAA",
        "project-dark-blue": "#11101A",
        "project-light-blue": "#222030",
        "project-middle-blue": "#181623",
        "project-gray": "#6C757D",
        "project-light-sky-blue": "#CED4DA",
        "project-outline-blue": "#929aa6",
        "project-danger": "#DC3545",
      },
      backgroundImage: {
        "dark-blue-gradient":
          "linear-gradient(180deg, #11101A 0%, #08080D 50.52%, rgba(0, 0, 0, 0) 100%)",
        "gradient-interstellar":
          "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), url('/src/assets/images/interstellar.png')",
        "gradient-lotr":
          "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), url('/src/assets/images/lotr.png')",
        "gradient-tenebaums":
          "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), url('/src/assets/images/tenebaums.png')",
        "mobile-modal-gradient":
          "linear-gradient(180deg, hsla(246, 24%, 8%, 1) 1%, hsla(245, 32%, 14%, 1) 100%)",
      },
      fontFamily: {
        "helvetica-ultra-light": "helvetica-ultralight",
        "helvetica-thin": "helvetica-thin",
        "helvetica-light": "helvetica-light",
        "helvetica-medium": "helvetica-medium",
        "helvetica-bold": "helvetica-bold",
        "helvetica-heawy": "helvetica-heawy",
        "helvetica-capslight": "helvetica-capslight",
        "helvetica-capsmedium": "helvetica-capsmedium",
      },
    },
    screens: {
      "2xl": { max: "1536px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "800px" },
      sm: { max: "639px" },
    },
  },
  plugins: [],
};
