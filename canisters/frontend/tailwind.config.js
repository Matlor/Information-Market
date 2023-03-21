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
			colorBackground: "#FFFFFF",
			colorBackgroundComponents: "#F5F5F5",
			colorDark: "#0F1318",
			colorText: "#0E1217",
			colorTextGrey: "#606060",
			colorIcon: "#0F1318",
			colorLines: "#F5F5F5",
			colorRed: "#F6A5A5",
			colorEffect: "#F3F8F7",
		},

		fontFamily: {
			OpenSans: "'Open Sans', sans-serif",
			ABeeZee: "'ABeeZee', sans-serif",
			SFPro: "'SF Pro', 'sans-serif'",
			nunito: ["nunito", "sans-serif"],
			lato: ["lato", "sans-serif"],
			poppins: ["poppins", "sans-serif"],
			Inter: ["Inter", "sans-serif"],
		},

		fontSize: {
			48: "48px",
			25: "25px",
			24: "24px",
			23: "23px",
			22.5: "22.5px",
			22: "22px",
			21: "21px",
			20: "20px",
			19: "19px",
			18: "18px",
			17: "17px",
			16: "16px",
			15: "15px",
			14: "14px",
			13: "13px",
			12: "12px",
			11: "11px",
			10: "10px",
		},

		fontWeight: {
			100: "100",
			150: "150",
			200: "200",
			250: "150",
			300: "300",
			350: "350",
			400: "400",
			450: "450",
			500: "500",
			550: "550",
			600: "600",
			650: "650",
			700: "700",
			750: "750",
			800: "800",
			850: "850",
			900: "900",
		},

		letterSpacing: {
			normal: "-0.01em",
			wide: "0.0145em",
			widest: "0.1em",
			tight: "-0.02em",
		},

		// offset-x | offset-y | blur-radius (adds to it) | spread-radius | color

		borderRadius: {
			none: "0",
			sm: "5px",
			md: "20px",
			lg: "30px",
			full: "9999px",
		},

		extend: {
			fontFamily: {
				SFPRO: ["SFPro", "sans-serif"],
				SF_Pro_Display: ["SF Pro Display", "sans-serif"],
			},

			lineHeight: {
				38: "38px",
				32: "32px",
				28: "28px",
				20: "20px",
				16: "16px",
				14: "14px",
				none: "1",
			},

			boxShadow: {
				/* md: "0px 2px 4px rgba(0, 0, 0, 0.04)",
				lg: "0px 4px 8px rgba(0, 0, 0, 0.04)", */
				choice: "0px 0px 1px 1px #F3F8F7",
			},
		},
	},
	plugins: [],
};
