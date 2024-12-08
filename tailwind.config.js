/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#fffff",
        white: {
          100: "#ffffff",
          300: "#F7F8F8",
        },
        secondary: {
          DEFAULT: "#95aefe",
          100: "#95AEFE",
          200: "#95c7fe",
          // 200: "#85c7fe",
          300: "#95AEFE",
        },
        black: {
          DEFAULT: "#000",
          100: "#6d6d6d",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        osbold: ["OpenSans-Bold", "sans-serif"],
        osextrabold: ["OpenSans-ExtraBold", "sans-serif"],
        osmedium: ["OpenSans-Medium", "sans-serif"],
        osregular: ["OpenSans-Regular", "sans-serif"],
        ossemibold: ["OpenSans-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
