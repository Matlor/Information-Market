import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ children, principal }) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!principal) {
			navigate("/");
		}
	}, [principal]);

	return <>{principal ? children : null}</>;
};

export default Protected;
