import React, { useState } from "react";

const FCRegister = ({ users, setUsers, setError, error }) => {
  // State to manage user input data
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

  // Function to handle changes in input fields
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    console.log("Current users before adding:", users);
    e.preventDefault();
    const result = validationCheck(e.target);
    let resultArray = Object.keys(result).map((key) => result[key]);
    if (Object.keys(resultArray).length === 0) {
      // If validation passes, read image file and update users state
      const reader = new FileReader();
      const imageFile = e.target.elements.image.files[0];
      reader.onload = function (event) {
        const imageDataURL = event.target.result;
        let userForm = new FormData(e.target);
        let userData = Object.fromEntries(userForm);
        userData.image = imageDataURL;
        setUsers((users) => [...users, userData]);
      };
      reader.readAsDataURL(imageFile);
      setError("");
    } else {
      setError(resultArray);
    }
    console.log("Updated users after adding:", users);
  };

  // Validation function to check user input
  function validationCheck(form) {
    let userForm = new FormData(form);
    let userData = Object.fromEntries(userForm);

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
    let fileName = userData.image.name;
    let fileExtension = fileName.split(".").pop().toLowerCase();

    // Check if the file extension is either 'jpg' or 'jpeg'
    if (fileExtension !== "jpg" && fileExtension !== "jpeg") {
      errors.image = "ניתן להעלות קבצי jpg או jpeg בלבד.";
    }

    // Validate firstName and lastName
    if (!/^[א-ת\s]+$/g.test(userData.firstName)) {
      errors.firstName = "שם פרטי יכול להכיל טקסט בלבד.";
    }
    if (!/^[א-ת\s]+$/g.test(userData.lastName)) {
      errors.lastName = "שם משפחה יכול להכיל טקסט בלבד.";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9._-]*@[a-zA-Z]+\.[a-zA-Z]{2,5}$/;
    if (!emailRegex.test(userData.email)) {
      errors.email = "כתובת מייל אינה חוקית.";
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

    if (!checkUsersList(userData.userName, userData.email)) {
      errors.avalible = "דוא''ל או שם משתמש כבר בשימוש.";
    }

    return errors;
  }

  // Function to check if user name and email are available
  function checkUsersList(userName, email) {
    let check = [];
    users.forEach((user) => {
      if (user.userName === userName || user.email === email) check.push(user);
    });
    if (!check.length) {
      return true;
    }
    return false;
  }

  return (
    <div id="register">
      <h2>משתמש חדש</h2>
      <div className="form-inputs">
        {" "}
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="User Name"
              name="userName"
              onChange={handleChange}
              value={data.userName}
              required
              className="input"
              autoComplete="off"
            />
            <input
              type="file"
              placeholder="Image"
              name="image"
              onChange={handleChange}
              value={data.image}
              className="input"
              accept=".jpg, .jpeg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input"
              autoComplete="off"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              name="passwordConfirmation"
              required
              className="input"
              autoComplete="off"
            />

            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
              value={data.firstName}
              required
              className="input"
              autoComplete="off"
            />

            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={data.lastName}
              required
              className="input"
              autoComplete="off"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="input"
              autoComplete="off"
            />

            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              type="text"
              placeholder="City"
              name="city"
              value={data.city}
              required
              className="input"
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Street"
              name="street"
              value={data.street}
              required
              className="input"
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Number"
              name="number"
              value={data.number}
              required
              className="input"
              onChange={handleChange}
            />
          </div>
          <button className="button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default FCRegister;
