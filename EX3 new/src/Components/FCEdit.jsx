import { useState, useEffect } from "react";
import { PROFILE_PROPS } from "../constants";
import { validationCheck } from "../utils";

export const FCEdit = ({ userToEdit, show, onClose }) => {
  // State for form data, error messages, user list, current user, and modal status
  const [data, setData] = useState(PROFILE_PROPS);
  const [error, setError] = useState("");
  const [users, setUsers] = useState(() => {
    // Load users from local storage or initialize an empty array
    const storedUsers = [JSON.parse(localStorage.getItem("users"))].flat();
    console.log("Stored Users:", storedUsers);
    return storedUsers?.length ? storedUsers : [PROFILE_PROPS];
  });
  const [currentUser, setCurrentUser] = useState(() => {
    // Load current user from local storage or initialize an empty user object
    const localValue = JSON.parse(localStorage.getItem("current-user"));
    return localValue?.userName ? localValue : PROFILE_PROPS;
  });

  const handleClose = () => {
    // Close the modal and execute the onClose callback
    onClose();
  };

  useEffect(() => {
    if (users?.length !== 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  // Handle form input change
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const [isImageChange, setIsImageChange] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validationCheck(
      e.target,
      users,
      isImageChange,
      userToEdit.email
    );
    const resultArray = Object.keys(result).map((key) => result[key]);
    if (Object.keys(resultArray).length === 0) {
      // Process form data and update user list
      const imageFile = e.target.elements.image.files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const imageDataURL = event.target.result;
          const userForm = new FormData(e.target);
          const userData = Object.fromEntries(userForm);
          userData.image = imageDataURL;
          const tempArr = users.find((user) => {
            userData.email === user.email;
          });
          setUsers([...tempArr, { ...userData, email: userToEdit.email }]);
          localStorage.setItem("users", JSON.stringify(users));
          if (currentUser.userName !== "admin") {
            setCurrentUser(userData);
            localStorage.setItem("current-user", JSON.stringify(userData));
          }
        };
        reader.readAsDataURL(imageFile);
      } else {
        const userForm = new FormData(e.target);
        const userData = Object.fromEntries(userForm);
        const tempArr = users.filter((user) => {
          userData.email !== user.email;
        });
        userData.image = userToEdit.image;
        setUsers([...tempArr, { ...userData, email: userToEdit.email }]);
        localStorage.setItem("users", JSON.stringify(users));
        if (currentUser.userName !== "admin") {
          setCurrentUser(userData);
          localStorage.setItem("current-user", JSON.stringify(userData));
        }
      }
      location.reload();
    } else {
      setError(resultArray);
    }
  };

  // Enable/disable image change based on checkbox
  function enableImageChange(e) {
    document.getElementById("imageChange").required = !!e.target.checked;
    document.getElementById("imageChange").disabled = !e.target.checked;
    setIsImageChange(!!e.target.checked);
  }

  // Render the modal if show prop is true
  return (
    show && (
      <div className="modal-overlay visible">
        <div className="modal show">
          <h1>עריכת משתמש</h1>
          <form id="editForm" onSubmit={handleSubmit}>
            {/* Display error message if there is an error */}
            {error && <div className="error">{error}</div>}

            {/* Form fields */}
            <div>
              <input
                type="text"
                name="userName"
                placeholder="User name"
                onChange={handleChange}
                defaultValue={userToEdit.userName}
                required
                className="input"
                autoComplete="off"
              />

              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                defaultValue={userToEdit.password}
                required
                className="input"
                autoComplete="off"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirmation"
                required
                defaultValue={userToEdit.password}
                className="input"
                autoComplete="off"
              />
              <br></br>

              <label>
                העלאת תמונה חדשה
                <input type="checkbox" onChange={enableImageChange} />
              </label>

              <input
                id="imageChange"
                type="file"
                name="image"
                onChange={handleChange}
                className="input"
                accept=".jpg, .jpeg"
                disabled
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                defaultValue={userToEdit.email}
                className="input"
                disabled
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="First name"
                name="firstName"
                onChange={handleChange}
                defaultValue={userToEdit.firstName}
                required
                className="input"
                autoComplete="off"
              />
              <input
                type="text"
                placeholder="Last name"
                name="lastName"
                onChange={handleChange}
                defaultValue={userToEdit.lastName}
                required
                className="input"
                autoComplete="off"
              />

              <input
                type="date"
                name="dateOfBirth"
                defaultValue={userToEdit.dateOfBirth}
                onChange={handleChange}
                required
                className="input"
              />

              <input
                type="text"
                placeholder="City"
                name="city"
                defaultValue={userToEdit.city}
                required
                className="input"
                onChange={handleChange}
              />

              <input
                type="text"
                placeholder="Street"
                name="street"
                defaultValue={userToEdit.street}
                required
                className="input"
                onChange={handleChange}
              />

              <input
                type="text"
                placeholder="Number"
                name="number"
                defaultValue={userToEdit.number}
                required
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="modalBtn">
              <button type="submit" className="button">
                Edit
              </button>
              <button type="button" className="button" onClick={handleClose}>
                ❌
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
