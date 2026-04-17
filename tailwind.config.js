/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4B8B",
        primaryDark: "#E03577",
        purple: "#9B6FE8",
        purpleDark: "#7B52C8",
        teal: "#1D9E75",
        tealDark: "#0F6E56",
      },
    },
  },
  plugins: [
    (module.exports = function (api) {
      api.cache(true);
      return {
        presets: ["babel-preset-expo"],
        plugins: ["nativewind/babel"],
      };
    }),
  ],
};
