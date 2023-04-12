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

		spacing: {
			1: "4px",
			2: "8px",
			3: "12px",
			4: "16px",
			5: "24px",
			6: "32px",
			7: "48px",
			8: "64px",
			9: "96px",
			10: "160px",
			11: "342px",
		},

		fontFamily: {
			poppins: ["poppins", "sans-serif"],
			inter: ["Inter", "sans-serif"],
		},

		fontSize: {
			lg: "22px",
			md: "18px",
			sm: "15.5px",
			xs: "12px",
		},

		fontWeight: {
			400: "400",
			420: "420",
			500: "500",
			600: "600",
		},

		// tracking-wide
		letterSpacing: {
			narrow: "-0.01em",
			none: "0",
			wide: "0.015em",
		},

		borderRadius: {
			none: "0",
			1: "5px",
			2: "10px",
			3: "50px",
			full: "9999px",
		},

		borderWidth: {
			0: "0",
			1: "1px",
			2: "2px",
			3: "3px",
			4: "4px",
			5: "5px",
			6: "6px",
			7: "7px",
			8: "8px",
			9: "9px",
			10: "10px",
		},

		colors: {
			transparent: "transparent",
			white: "#FFFFFF",
			black: "#000000",
			gray: {
				100: "#F6F6F6",
				500: "#707072",
				800: "#0E1217",
			},
			red: "#EE5C41",
			blue: {
				100: "#267DFF",
				500: "#ECFCFF",
			},
		},

		extend: {
			// leading
			lineHeight: {
				lg: "31.5px",
				md: "27.5px",
			},

			boxShadow: {
				md: "0px 0px 3px  rgb(0 0 0 / 0.1)",
			},

			iconSizes: (theme) => ({
				sm: theme("spacing.3"), // Corresponds to fontSize.sm and spacing[4]
				md: theme("spacing.4"), // Corresponds to fontSize.md and spacing[5]
				lg: theme("spacing.5"), // Corresponds to fontSize.lg and spacing[6]
			}),
		},
	},
	plugins: [],
};

/* md: "0px 2px 4px rgba(0, 0, 0, 0.04)",
				lg: "0px 4px 8px rgba(0, 0, 0, 0.04)", */
//choice: "0px 0px 1px 1px #F3F8F7",

/* fontFamily: {
			OpenSans: "'Open Sans', sans-serif",
			ABeeZee: "'ABeeZee', sans-serif",
			SFPro: "'SF Pro', 'sans-serif'",
			nunito: ["nunito", "sans-serif"],
			lato: ["lato", "sans-serif"],
			poppins: ["poppins", "sans-serif"],
			Inter: ["Inter", "sans-serif"],
		}, */

/* fontSize: {
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
		}, */

/* 
		letterSpacing: {
			normal: "-0.01em",
			wide: "0.0145em",
			widest: "0.1em",
			tight: "-0.02em",
		},
		
		*/

/* borderRadius: {
			none: "0",
			xsm: "2px",
			sm: "5px",
			md: "20px",
			lg: "30px",
			full: "9999px",
		}, */

/* fontFamily: {
				SFPRO: ["SFPro", "sans-serif"],
				SF_Pro_Display: ["SF Pro Display", "sans-serif"],
			}, */

/* lineHeight: {
				38: "38px",
				32: "32px",
				28: "28px",
				20: "20px",
				16: "16px",
				14: "14px",
				none: "1",
			}, */

/* fontWeight: {
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
		}, */

// offset-x | offset-y | blur-radius (adds to it) | spread-radius | color

/* colors: {
				colorBackground: "#FFFFFF",
				colorBackgroundComponents: "#F5F5F5",
				colorDark: "#0F1318",
				colorText: "#0E1217",
				colorTextGrey: "#8E8E8E",
				colorIcon: "#0F1318",
				colorLines: "#F5F5F5",
				colorRed: "#F6A5A5",
				colorEffect: "#F3F8F7",
			}, */
