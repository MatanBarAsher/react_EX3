import { useState, useEffect } from "react";
import FCEdit from "./FCEdit";

const FCProfile = ({ currentUser }) => {
  const [profile, setProfile] = useState(() => {
    let localValue = JSON.parse(localStorage.getItem("current-user"));
    if (localValue?.firstName !== "") {
      return localValue;
    }
    return {
      userName: "",
      password: "",
      image: "",
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      city: "",
      street: "",
      number: "",
    };
  });
  const [ToShow, setToShow] = useState(false);
  useEffect(() => {
    setProfile(currentUser);
  }, [currentUser]);

  function handleEditBtn() {
    setToShow(true);
  }

  function handleGameBtn() {
    window.open("https://www.falafelgame.com/");
  }

  function handleLogOut() {
    localStorage.removeItem("current-user");
    location.reload();
  }

  return (
    <>
      <div id="profile" className="profile">
        <div id="profileImg" className="right profile-image">
          <img src={profile?.image} alt="user image" />
        </div>
        <div id="profileDetails" className="left">
          <h2>
            {profile.firstName} {profile.lastName}
          </h2>
          <table style={{ margin: 15 }}>
            <tbody>
              <tr>
                <td>שם משתמש:</td>
                <td>{profile?.userName}</td>
              </tr>
              <tr>
                <td>🏠</td>
                <td>
                  {profile?.city}, {profile.street}, {profile.number}
                </td>
              </tr>
              <tr>
                <td>🎂</td>
                <td>{profile.dateOfBirth}</td>
              </tr>
            </tbody>
          </table>

          <div id="profileButtons">
            <button className="button" onClick={handleEditBtn}>
              Update details
            </button>
            <button className="button" onClick={handleGameBtn}>
              Game
            </button>
            <button className="button" onClick={handleLogOut}>
              Log out
            </button>
          </div>
        </div>
      </div>
      <FCEdit userToEdit={profile} toShow={ToShow} />
    </>
  );
};

export default FCProfile;
