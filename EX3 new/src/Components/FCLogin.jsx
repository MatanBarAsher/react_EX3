import { useState, useEffect } from "react";
import { PROFILE_PROPS } from "../constants";

export const FCLogin = () => {
  // State for user list, form data, error messages, and current user
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    // Load current user from local storage or initialize an empty user object
    const localValue = JSON.parse(localStorage.getItem("current-user"));

    return localValue?.userName ? localValue : PROFILE_PROPS;
  });

  // Load users from local storage when the component mounts
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  // Handle input change in the form
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Save current user to local storage when it changes
  useEffect(() => {
    if (currentUser.firstName !== "") {
      localStorage.setItem("current-user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const userInput = new FormData(e.target);
    const userData = Object.fromEntries(userInput);

    // Check if the user is admin
    if (userData.userName === "admin" && userData.password === "ad12343211ad") {
      setError("");
      setCurrentUser(userData);
      location.reload();
      return;
    }
    const match = users.find(
      (user) =>
        user.userName === userData.userName &&
        user.password === userData.password
    );
    // Check if there's a match in the users list
    if (match) {
      setError("");
      setCurrentUser(match);
      location.reload();
      return;
    }
    // Display error if no match found
    setError("שם המשתמש או הסיסמה לא תקינים.");
  };

  // Render the login form
  return (
    <>
      <div id="login">
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <h2>משתמש קיים</h2>
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

          <button type="submit" className="button">
            Log in
          </button>
        </form>
      </div>
    </>
  );
};
