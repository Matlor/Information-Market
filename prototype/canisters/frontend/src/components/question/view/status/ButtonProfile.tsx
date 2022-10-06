import Profile from "../../../core/view/Profile";
import ButtonSmall from "../../../core/view/ButtonSmall";

const ButtonProfile = ({ text, toCall, userName }) => {
	return (
		<div className="flex items-center h-full px-[60px] py-[30px] gap-[22px] text-normal  bg-colorBackgroundComponents rounded-md shadow-md">
			<div className="flex flex-col gap-[10px] items-start justify-center">
				<div className="text-normal w-[175px]">{text}</div>
				<ButtonSmall
					propFunction={toCall}
					text={"Submit"}
					font={"text-normal"}
				/>
			</div>

			<div className="flex flex-col items-start justify-center">
				<Profile name={userName} />
			</div>
		</div>
	);
};

export default ButtonProfile;
