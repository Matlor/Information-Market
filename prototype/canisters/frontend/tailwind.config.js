/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		colors: {
			colorBackground: "#F4FAFF",
			colorBackgroundComponents: "#FFFFFC",
			colorText: "#605E5D",
			colorIcon: "#969696",
			colorLines: "#D8E0E5",
			colorRed: "#FF5757",
		},

		fontFamily: {
			OpenSans: "'Open Sans', sans-serif",
			ABeeZee: "'ABeeZee', sans-serif",
		},

		fontSize: {
			48: "48px",
			20: "20px",
			18: "18px",
			14: "14px",
			12: "12px",
		},

		letterSpacing: {
			normal: "0px",
			wide: "0.04em",
			widest: "0.1em",
		},

		lineHeight: {
			27: "27px",
			25: "25px",
			19: "19px",
			16: "16px",
		},

		boxShadow: {
			md: "0px 2px 4px rgba(0, 0, 0, 0.04)",
			lg: "0px 4px 8px rgba(0, 0, 0, 0.04)",
		},

		borderRadius: {
			none: "0",
			sm: "2px",
			md: "10px",
			lg: "25px",
			full: "9999px",
		},

		extend: {},
	},
	plugins: [],
};
