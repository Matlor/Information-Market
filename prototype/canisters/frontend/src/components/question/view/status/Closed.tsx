import Profile from "../../../core/view/Profile";

const Closed = () => {
	return (
		<div className="flex items-center gap-[51px] px-[51px] py-[50px] bg-colorBackgroundComponents shadow-md rounded-md">
			<div>
				<div className="heading3-18px">3 ICP</div>
				<div className="text-small-12px">Total Payout</div>
			</div>
			<div>
				<Profile name={"name"} />
			</div>
		</div>
	);
};

export default Closed;
