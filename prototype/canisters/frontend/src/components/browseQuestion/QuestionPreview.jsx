import ProfileAnswers from "../coreComponents/ProfileAnswers";
import StagesBar from "./StagesBar";

const QuestionPreview = ({ question }) => {
	return (
		<div className="flex justify-center items-start py-[23px] pr-[48px] pl-[27px] gap-[46px] bg-colorBackgroundComponents shadow-md rounded-md">
			<div className="flex-col ">
				<div className="heading3-18px">3 ICP</div>
				<div className="text-14px ">Disputable</div>
				<StagesBar />
			</div>

			<svg
				width="2"
				height="121"
				viewBox="0 0 2 121"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<line
					x1="1"
					y1="-4.43495e-08"
					x2="1.00001"
					y2="121"
					stroke="#CED8DE"
					strokeOpacity="0.8"
					strokeWidth="2"
				/>
			</svg>

			<div className="flex-col ">
				<div className="heading3-18px">
					{" "}
					What is the meaning of Life? I mean what if it really is 24 like in
					the movieWhat is the meaning of Life? I mean what if it really is 24
					like in the movieWhat is the meaning of Life? I mean what if it really
					is 24 like in the movieWhat is the mea ning of Life? I mean what if it
					really is 24 like.
				</div>

				<ProfileAnswers />
			</div>
		</div>
	);
};

export default QuestionPreview;
