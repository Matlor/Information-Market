const Profile = ({ name, avatar }: any) => {
	return (
		<div className="flex items-center p-0 gap-2.5 w-max">
			<img className="rounded-full w-[34px] h-[34px]" src={avatar} alt="" />

			<div className="text-small-12px"> Posted by {name}</div>
		</div>
	);
};

export default Profile;
