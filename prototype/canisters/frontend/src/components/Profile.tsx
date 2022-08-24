import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Profile = ({ plug, logout, user, fetchCurrentUser }: any) => {

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [userName, setUserName] = useState<string>(user.userName);
  const [joinedDate] = useState<string>(user.joinedDate);
  const [avatar, setAvatar] = useState<string>(user.avatar);

  const showOpenFileDialog = () => {
    imageRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    var reader = new FileReader();
		reader.readAsDataURL(file);
    reader.onloadend = async function() {
      setAvatar(reader.result as string);
    };
  };

  const handleNameChange = (event) => {
    setUserName(event.target.value);
  }

  const updateProfile = async () => {
		let updateUser = await plug.actors.marketActor.update_user(userName, avatar);
    if (!updateUser.ok) {
      console.error("Failed to update user: " + updateUser.err);
    } else {
      fetchCurrentUser();
    }
  }

  return (
    <>
    {plug.isConnected ? (
      <div className="flex flex-col items-center space-y-5">
        <div className="flex w-60 h-60">
          <input type='file' ref={imageRef} style={{display: 'none'}} onChange={handleImageChange}/>
          <img className="rounded-full hover:cursor-pointer" onClick={showOpenFileDialog} src={avatar} alt=""/>
        </div>
      <div className="space-y-1 flex-grow font-medium">
        <input type="text" className="bg-transparent border-none text-gray-900 text-xl font-semibold rounded-lg w-30 p-2.5 text-center" onChange={handleNameChange} placeholder={userName}/>
        <div className="text italic text-center text-gray-900">Joined {joinedDate}</div>
      </div>
      <div className="flex flex-row space-x-5">
        <button className="my-button w-40" onClick={updateProfile}>
          Save changes
        </button>
        <Link to="/" onClick={logout}>
          <button className="my-button w-40">
            Log out
          </button>
        </Link>
      </div>
    </div>
    ) : 
      <div className="text italic text-center text-gray-900">Not connected</div>
    }
    </>
  );
}

export default Profile;