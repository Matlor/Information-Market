const Profile = ({ name, avatar }: any) => {
	return (
		<div className="flex items-center p-0 gap-2.5 w-max ">
			<img className="rounded-full w-[27px] h-[27px]" src={avatar} alt="" />
			<div className="text-small w-[60px] text-ellipsis overflow-hidden">
				{name}
			</div>
		</div>
	);
};

export default Profile;
