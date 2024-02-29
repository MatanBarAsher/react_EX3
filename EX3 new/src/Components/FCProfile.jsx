import { useState, useEffect } from "react";
import FCEdit from "./FCEdit";

const FCProfile = ({ currentUser }) => {
  // State to manage the user's profile information
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

  // State to manage whether the edit modal should be shown
  const [ToShow, setToShow] = useState(false);

  // Effect to update the profile state when the currentUser prop changes
  useEffect(() => {
    setProfile(currentUser);
  }, [currentUser]);

  // Function to handle the "Edit Details" button click
  function handleEditBtn() {
    setToShow(true);
  }

  // Function to handle the "Game" button click
  function handleGameBtn() {
    window.open("https://www.falafelgame.com/");
  }

  // Function to handle the "Log Out" button click
  function handleLogOut() {
    localStorage.removeItem("current-user");
    location.reload();
  }

  // Function to handle modal closing
  const closeModal = () => {
    setToShow(false);
  };

  // rendering the user's profile information and buttons
  return (
    <>
      <div id="profile" className="profile visible">
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
      <FCEdit userToEdit={profile} toShow={ToShow} onClose={closeModal} />
    </>
  );
};

export default FCProfile;
