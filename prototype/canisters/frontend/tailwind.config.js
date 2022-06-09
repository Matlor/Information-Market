module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			inter: "'Inter', sans-serif",
			sans: ["ui-sans-serif", "system-ui"],
			ibm: ["'IBM Plex Sans'", "sans-serif"],
		},
		extend: {
			minHeight: (theme) => ({
				...theme("spacing"),
			}),
			colors: {
				primary: "#FCFCFC",
				secondary: "#F5F5F5",
				third: "#5B504D",
				textGrey: "#1a1a1b",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
