import React, { useState } from "react";

//Constants
import { PROFILE_PROPS } from "../constants";

//Utils
import { validationCheck } from "../utils";

export const FCRegister = ({ users, setUsers, setError, error }) => {
  // State to manage user input data
  const [data, setData] = useState(PROFILE_PROPS);

  // Function to handle changes in input fields
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    console.log("Current users before adding:", users);
    e.preventDefault();
    const result = validationCheck(e.target, users);
    console.log("result", result);
    const resultArray = Object.keys(result).map((key) => result[key]);
    if (Object.keys(resultArray).length === 0) {
      // If validation passes, read image file and update users state
      const reader = new FileReader();
      const imageFile = e.target.elements.image.files[0];
      reader.onload = function (event) {
        const imageDataURL = event.target.result;
        const userForm = new FormData(e.target);
        const userData = Object.fromEntries(userForm);
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

  return (
    <div id="register">
      <h2>משתמש חדש</h2>
      <div className="form-inputs">
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
