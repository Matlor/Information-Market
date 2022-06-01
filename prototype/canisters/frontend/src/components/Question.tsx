import { useEffect, useState } from "react";
import { useParams } from "react-router";
import sudograph from "../api/sudograph";
import QuestionPreview from "./QuestionPreview";

// in list: <Link to={`/list/${idx}`}>{toDo.title}</Link>
// where does it get params from? Just from URL.

const Question = () => {
	// Whatever component receives as a URL parameter it will fetch
	// What if I pass invalid id? Maybe it should check for the right format.

	let { id } = useParams();

	const [questionState, setQuestionState] = useState<any>({
		question: {},
		hasData: false,
	});
	console.log(questionState, "state");

	useEffect(() => {
		(async () => {
			try {
				const {
					data: { readQuestion },
				} = await sudograph.get_question(id);

				if (readQuestion.length > 0) {
					setQuestionState({ question: readQuestion[0], hasData: true });
				}
			} catch (err) {
				// handle error (or empty response)
				console.log(err);
			}
		})();
	}, []);

	// if call fails it should render an error message
	// should not render anything until call fails or loading.
	return (
		<>
			{questionState.hasData ? (
				<div className="m-20 ">
					<>
						<div className="mb-8 ">
							<div className="font-light text-xs mb-1">
								Created at:{" "}
								{new Date(
									Number(questionState.question.creation_date) / 1000000
								).toLocaleString(undefined, {
									hour: "numeric",
									minute: "numeric",
									month: "short",
									day: "numeric",
								})}
							</div>
							<div className="font-light text-2xl mb-2 ">
								Lorem Ipsum is simply dummy text of the printing and type
								setting industry. Lorem Ipsum has been the{" "}
								{questionState.question.content}
							</div>
							<p className="text-justify font-light">
								Created in component! Lorem Ipsum is simply dummy text of the
								printing and typesetting industry. Lorem Ipsum has been the
								industry's standard dummy text ever since the 1500s, when an
								unknown printer took a galley of type and scrambled it to make a
								type specimen book. It has survived not only five centuries, but
								also the leap into electronic typesetting, remaining essentially
							</p>
						</div>

						<div className="flex  items-center">
							<div className="flex items-center mr-5 font-light">
								{Math.round(Number(questionState.question.reward) * 10000) /
									10000}{" "}
								ICP
							</div>
						</div>
					</>
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default Question;
