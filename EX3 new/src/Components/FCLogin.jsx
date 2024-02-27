import { useState, useEffect } from "react";

const FCLogin = () => {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
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

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    if (currentUser.firstName !== "") {
      localStorage.setItem("current-user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInput = new FormData(e.target);
    const userData = Object.fromEntries(userInput);

    if (userData.userName === "admin" && userData.password === "ad12343211ad") {
      setError("");
      setCurrentUser(userData);
      return;
    }

    const match = users.find(
      (user) =>
        user.userName === userData.userName &&
        user.password === userData.password
    );
    console.log(match);
    if (match) {
      setError("");
      setCurrentUser(match);
      return;
    }
    setError("שם המשתמש או הסיסמה לא תקינים.");
  };

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

export default FCLogin;
