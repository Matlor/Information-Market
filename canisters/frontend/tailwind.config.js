/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		screens: {
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1450px",
		},

		spacing: {
			0: "0px",
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

		fontFamily: {
			poppins: ["poppins", "sans-serif"],
			inter: ["Inter", "sans-serif"],
		},

		fontSize: {
			lg: "20px",
			md: "16px",
			sm: "14px",
			xs: "13px",
		},

		fontWeight: {
			200: "200",
			300: "300",
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
			widest: "0.005em",
		},

		extend: {
			// leading
			lineHeight: {
				lg: "27.5px",
				md: "27.5px",
			},

			backgroundColor: {
				noise: `transparent`,
			},

			boxShadow: {
				md: "0px 0px 3px rgb(0 0 0 / 0.1)",
				lg: "0px 1px 2px rgb(0 0 0 / 0.2)",
				xl: "0px 1px 3px rgb(0 0 0 / 0.2)",
				//"noise-points": generateNoisePoints(200, 10, 0.2, 0.6),
			},

			iconSizes: (theme) => ({
				sm: theme("spacing.3"), // Corresponds to fontSize.sm and spacing[4]
				md: theme("spacing.4"), // Corresponds to fontSize.md and spacing[5]
				lg: theme("spacing.5"), // Corresponds to fontSize.lg and spacing[6]
			}),

			colors: {
				transparent: "transparent",
				white: "#FFFFFD",
				black: "#000000",
				gray: {
					100: "#F6F6F6",
					200: "#E9E9E9",
					300: "#D2D2CC",
					400: "#9F9F9F",

					500: "#5C5C62",
					800: "#404038",
					//800: "#1E1C1A",
				},

				/* 
				gray: {
					100: "#F6F6F6",
					500: "#5C5C62",
					800: "#0E1217",
				},
				
				
				*/
				red: "#EE5C41",
				accent: {
					200: "#426E86",
					400: "#F8F1E5",
				},

				brown: "#F8F1E5",
				/* 
				accent 200: FFE2A9
				accent 400: FF3E00
				
				*/

				/* 
				blue
				200: "#ECFCFF",
					400: "#267DFF",
				*/
			},
		},
	},
	plugins: [],
};

/* const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const generateNoisePoints = (numPoints, maxOffset, minOpacity, maxOpacity) => {
	let boxShadow = "";

	for (let i = 0; i < numPoints; i++) {
		const x = random(-maxOffset, maxOffset);
		const y = random(-maxOffset, maxOffset);
		const opacity = (
			Math.random() * (maxOpacity - minOpacity) +
			minOpacity
		).toFixed(2);

		boxShadow += `${x}px ${y}px rgba(0, 0, 0, ${opacity})`;

		if (i < numPoints - 1) {
			boxShadow += ", ";
		}
	}

	return boxShadow;
}; */
