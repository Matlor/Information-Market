import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Profile = ({ plug, logout }: any) => {

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [userName, setUserName] = useState<string>(plug.userName);
  const [joinedDate] = useState<string>(plug.joinedDate);
  const [avatar, setAvatar] = useState<string>(plug.avatar);

  const showOpenFileDialog = () => {
    imageRef.current.click();
  };

  const handleImageChange = (event) => {
    console.log("Change image")
    const file = event.target.files[0];
    console.log("file is " + file.toString())
    var reader = new FileReader();
		reader.readAsDataURL(file);
    reader.onloadend = async function() {
      setAvatar(reader.result as string);
    };
  };

  const handleNameChange = (event) => {
    console.log("Set name to:" + event.target.value)
    setUserName(event.target.value);
  }

  const updateProfile = async () => {
		let updateUser = await plug.actors.marketActor.update_user(window.ic.plug.principalId, userName, avatar);
    console.log(updateUser.err);
    if (!updateUser.ok) {
      console.log("Failed to update user!");
      return;
    }
  }

  return (
    <>
    {plug.isConnected ? (
      <div className="flex flex-col items-center space-y-5">
        <div className="flex w-60 h-60">
          <input type='file' ref={imageRef} style={{display: 'none'}} onChange={handleImageChange}/>
          <img className="rounded-full hover:cursor-pointer" onClick={showOpenFileDialog} src={avatar} alt="avatar"/>
        </div>
      <div className="space-y-1 flex-grow font-medium">
        <input type="text" className="bg-transparent border-none text-gray-900 text-xl font-semibold rounded-lg w-30 p-2.5 text-center" onChange={handleNameChange} placeholder={userName}/>
        <div className="text italic text-center text-gray-900">{joinedDate}</div>
      </div>
      <div className="flex flex-row space-x-5">
        <Link to="/" onClick={updateProfile}>
          <button className="my-button w-40">
            Save changes
          </button>
        </Link>
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