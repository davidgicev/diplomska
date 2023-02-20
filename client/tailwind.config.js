/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'olive': '#3c3e3c',
        'opal': '#9DB5B2',
        'light-cyan': '#e0ebea',
        'middle-green': '#c2d6d0',
        'mint-cream': '#f3f7f6',
        'nickel': '#6d746d',
        'light-olive': '#4f5450'
      },
    }
  },
  plugins: [],
}
