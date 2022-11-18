import emailjs from "@emailjs/browser";

export const Mail = (text) => {
	var templateParams = {
		subject: text,
	};

	emailjs
		.send(
			"service_l0oc4dc",
			"template_h97qeuo",
			templateParams,
			"V1YWFKtRZuyT0TUm2"
		)
		.then(
			(result) => {
				console.log(result.text);
			},
			(error) => {
				console.log(error.text);
			}
		);
};
