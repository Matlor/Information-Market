import { Navigate } from "react-router-dom";
import sudograph from "../api/sudograph";
import { useEffect, useState } from "react";
import QuestionPreview from "./QuestionPreview";

const Interactions = ({ plug }: any) => {
	if (!plug.isConnected) {
		return <Navigate to="/" replace />;
	}

	const [myQuetions, setMyQuetions] = useState<any>([]);

	const fetch_my_questions = async () => {
		const res = await sudograph.get_questions_interactions(
			plug.plug.principalId
		);
		setMyQuetions(res.data.readQuestion);
	};

	useEffect(() => {
		fetch_my_questions();
	}, []);

	return (
		<div className=" ">
			<div className="mb-10">
				<h1 className="text-2xl  mr-4 font-medium "> My Interactions</h1>
			</div>
			<div className="">
				{myQuetions.length > 0 ? (
					myQuetions.map((question: any, index: number) => {
						return (
							<div key={index}>
								<QuestionPreview question={question} />
							</div>
						);
					})
				) : (
					<div></div>
				)}
			</div>
		</div>
	);
};

export default Interactions;
