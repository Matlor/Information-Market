/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		screens: {
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},

		colors: {
			colorBackground: "#EBF2ED",
			colorBackgroundDark: "#DFE7E1",
			colorBackgroundComponents: "#FFFFFC",
			colorText: "#605E5D",
			colorIcon: "#969696",
			colorLines: "#D8E0E5",
			colorRed: "#F6A5A5",
			colorEffect: "#F3F8F7",
		},

		fontFamily: {
			OpenSans: "'Open Sans', sans-serif",
			ABeeZee: "'ABeeZee', sans-serif",
		},

		fontSize: {
			48: "48px",
			25: "25px",
			22: "22px",
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
			38: "38px",
			28: "28px",
			16: "16px",
		},
		// offset-x | offset-y | blur-radius (adds to it) | spread-radius | color

		boxShadow: {
			md: "0px 2px 4px rgba(0, 0, 0, 0.04)",
			lg: "0px 4px 8px rgba(0, 0, 0, 0.04)",
			choice: "0px 0px 4px 6px #F3F8F7",
		},

		borderRadius: {
			none: "0",
			sm: "2px",
			md: "17px",
			lg: "30px",
			full: "9999px",
		},

		extend: {},
	},
	plugins: [],
};
