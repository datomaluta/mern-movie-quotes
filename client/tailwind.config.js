/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "project-red": "#E31221",
        "project-yellow": "#DDCCAA",
        "project-dark-blue": "#11101A",
        "project-light-blue": "#222030",
      },
      backgroundImage: {
        "dark-blue-gradient":
          "linear-gradient(180deg, #11101A 0%, #08080D 50.52%, rgba(0, 0, 0, 0) 100%)",
        "custom-gradient":
          "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 55.21%, rgba(0, 0, 0, 0) 100%), url('/src/assets/images/interstellar.png')",
        "bg-image": "url('/src/assets/images/interstellar.png')",
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
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "800px" },
      sm: { max: "639px" },
    },
  },
  plugins: [],
};
