module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			inter: "'Inter', sans-serif",
			sans: ["ui-sans-serif", "system-ui"],
		},
		extend: {
			colors: {
				primary: "#FFFBF6",
				secondary: "#F5F5F5",
				third: "#5B504D",
			},
		},
	},
	plugins: [],
};
