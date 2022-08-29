import Profile from "./Profile";
import Answer from "./NumberOfAnswers";

const ProfileAnswers = ({ name, answers }) => {
	return (
		<div className="flex items-center gap-5 w-max">
			<Profile name={name} />
			<Answer answers={answers} />
		</div>
	);
};

export default ProfileAnswers;
