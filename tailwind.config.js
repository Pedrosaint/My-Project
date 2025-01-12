/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fea928",
        secondary: "#ed8900",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // Roboto Font
        custom: ["CustomFont", "serif"], // Custom uploaded font
        openSans: ['"Open Sans"', "sans-serif"], // Open Sans font
        quicksand: ['"Quicksand"', "sans-serif"], // Quicksand font
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(125deg, #fea928, #ff758c, #aae56c)",
        "custom": "linear-gradient(125deg, #FEA928, #a9878c, #FFA500, #aaa,#a9878c )",
        "custom_1": "linear-gradient(125deg, #aaa, #a9878c, #aaa,#a9878c )",
      },
    },
  },
  plugins: [],
};

