/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "project-red": "#E31221",
        "project-yellow": "#DDCCAA",
        "project-dark-blue": "#11101A",
      },
      backgroundImage: {
        "dark-blue-gradient":
          "linear-gradient(180deg, #11101A 0%, #08080D 50.52%, rgba(0, 0, 0, 0) 100%)",
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
