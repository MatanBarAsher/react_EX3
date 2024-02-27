import { useState } from "react";

function FCRegister({ validationCheck, addUser }) {
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

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = (e) => {
    console.log("Current users before adding:", users);
    e.preventDefault();
    const result = validationCheck(e.target);
    let resultArray = Object.keys(result).map((key) => result[key]);
    if (Object.keys(resultArray).length === 0) {
      //add user
      const reader = new FileReader();
      const imageFile = e.target.elements.image.files[0];
      reader.onload = function (event) {
        const imageDataURL = event.target.result;
        let userForm = new FormData(e.target);
        let userData = Object.fromEntries(userForm);
        userData.image = imageDataURL;
        addUser(userData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setError(resultArray);
    }
    console.log("Updated users after adding:", users);
  };
  return (
    <div className="main">
      <div className="reg-form">
        <div className="form-h1">
          <h1>Add New User</h1>
        </div>
        <div className="form-inputs">
          <h1>Enter User Details</h1>
          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
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

            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FCRegister;
