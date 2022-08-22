import Profile from "./Profile";
import Answer from "./NumberOfAnswers";

const ProfileAnswers = () => {
	return (
		<div className="flex items-center gap-5 w-max">
			<Profile />
			<Answer />
		</div>
	);
};

export default ProfileAnswers;
