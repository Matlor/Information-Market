import emailjs from "@emailjs/browser";

const Mail = (text: string) => {
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

export default Mail;
