import { useState, useEffect } from "react";

const FCEdit = ({ userToEdit, toShow, onClose }) => {
  // State for form data, error messages, user list, current user, and modal status
  const [data, setData] = useState({
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
  });
  const [error, setError] = useState("");
  const [users, setUsers] = useState(() => {
    // Load users from local storage or initialize an empty array
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    console.log("Stored Users:", storedUsers);
    if (storedUsers) {
      return storedUsers;
    }
    return [];
  });
  const [currentUser, setCurrentUser] = useState(() => {
    // Load current user from local storage or initialize an empty user object
    let localValue = JSON.parse(localStorage.getItem("current-user"));
    if (localValue?.userName) {
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
  const [modalOpen, setModalOpen] = useState(true);

  const handleClose = () => {
    // Close the modal and execute the onClose callback
    setModalOpen(false);
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validationCheck(e.target);
    let resultArray = Object.keys(result).map((key) => result[key]);
    if (Object.keys(resultArray).length === 0) {
      // Process form data and update user list
      const imageFile = e.target.elements.image.files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const imageDataURL = event.target.result;
          let userForm = new FormData(e.target);
          let userData = Object.fromEntries(userForm);
          userData.image = imageDataURL;
          let tempArr = users.filter((user) => {
            userData.email !== user.email;
          });
          setUsers([...tempArr, userData]);
          localStorage.setItem("users", JSON.stringify(users));
          if (currentUser.userName !== "admin") {
            setCurrentUser(userData);
            localStorage.setItem("current-user", JSON.stringify(userData));
          }
        };
        reader.readAsDataURL(imageFile);
      } else {
        let userForm = new FormData(e.target);
        let userData = Object.fromEntries(userForm);
        let tempArr = users.filter((user) => {
          userData.email !== user.email;
        });
        userData.image = userToEdit.image;
        setUsers([...tempArr, userData]);
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

  // Validate form input
  function validationCheck(form) {
    let userForm = new FormData(form);
    let userData = Object.fromEntries(userForm);
    // Validation logic for each form field

    const errors = {};

    // Validate userName
    if (
      !/^[a-zA-Z0-9!@#$%^&*()-_+=~`[\]{}|;:'",.<>?/\\]+$/g.test(
        userData.userName
      )
    ) {
      errors.userName =
        "שם משתמש יכול לכלול אותיות לועזיות, מספרים ותווים מיוחדים.";
    } else if (userData.userName.length > 60) {
      errors.userName = "אורך השם משתמש לא יכול להיות יותר מ-60 תווים.";
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,12}$/;
    if (!passwordRegex.test(userData.password)) {
      errors.password =
        "סיסמה חייבת לכלול בין 7 ל-12 תווים, אות גדולה, ספרה ותו מיוחד.";
    }

    // Validate password confirmation
    if (userData.password !== userData.passwordConfirmation) {
      errors.passwordConfirmation = "אימות הסיסמה אינו תואם לסיסמה שהוזנה.";
    }

    // Validate image file type
    // Get the file extension
    if (userData.image) {
      let fileName = userData.image.name;
      let fileExtension = fileName.split(".").pop().toLowerCase();
      // Check if the file extension is either 'jpg' or 'jpeg'
      if (fileExtension !== "jpg" && fileExtension !== "jpeg") {
        errors.image = "ניתן להעלות קבצי jpg או jpeg בלבד.";
      }
    }

    // Validate firstName and lastName
    if (!/^[א-ת\s]+$/g.test(userData.firstName)) {
      errors.firstName = "שם פרטי יכול להכיל טקסט בלבד.";
    }
    if (!/^[א-ת\s]+$/g.test(userData.lastName)) {
      errors.lastName = "שם משפחה יכול להכיל טקסט בלבד.";
    }

    // Validate dateOfBirth
    const birthDate = new Date(userData.dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (isNaN(birthDate) || birthDate > currentDate) {
      errors.dateOfBirth = "תאריך לידה לא חוקי.";
    } else if (age < 18 || age > 120) {
      errors.dateOfBirth = "גיל המשתמש לא יכול להיות קטן מ-18 או גדול מ-120.";
    }

    // Validate city
    const validCities = [
      "ירושלים",
      "תל אביב",
      "חיפה",
      "באר שבע",
      "אילת",
      "נתניה",
      "אשדוד",
      "עפולה",
      "רמת גן",
      "חרב לאת",
    ];
    if (!validCities.includes(userData.city)) {
      errors.city = "עיר לא תקינה.";
    }

    // Validate street
    if (!/^[א-ת]+$/g.test(userData.street)) {
      errors.street = "שם רחוב יכול להכיל טקסט בלבד.";
    }

    // Validate number
    if (!/^\d+$/g.test(userData.number) || parseInt(userData.number) < 0) {
      errors.number = "מספר יכול להכיל ספרות בלבד ואינו יכול להיות שלילי.";
    }

    // Check if a username is available in the user list
    if (!checkUsersList(userData.userName)) {
      errors.avalible = "דוא''ל או שם משתמש כבר בשימוש.";
    }

    return errors;
  }

  function checkUsersList(userName) {
    let check = [];
    users.forEach((user) => {
      if (user.userName === userName) check.push(user);
    });
    if (check.length < 2) {
      return true;
    }
    return false;
  }

  // Enable/disable image change based on checkbox
  function enableImageChange(e) {
    if (e.target.checked) {
      document.getElementById("imageChange").required = true;
      document.getElementById("imageChange").disabled = false;
    } else {
      document.getElementById("imageChange").disabled = true;
      document.getElementById("imageChange").required = false;
    }
  }

  // Render the modal if toShow prop is true
  if (toShow) {
    return (
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
                onChange={handleChange}
                defaultValue={userToEdit.email}
                required
                className="input"
                autoComplete="off"
                readOnly
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
    );
  }
  // Return null if toShow is false
  return null;
};

export default FCEdit;
