import { useState, useEffect } from "react";
import "./App.css";
import FCLogin from "./Components/FCLogin";
import FCProfile from "./Components/FCProfile";
import FCSystemAdmin from "./Components/FCSystemAdmin";
import FCRegister from "./Components/FCRegister";

function App() {
  // State for user data, error messages, user list, current user, and view
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

  const [view, setView] = useState("");

  // Save users to local storage when the users state changes
  useEffect(() => {
    if (users?.length !== 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  // Set the view based on the current user and users list
  useEffect(() => {
    if (currentUser.userName === "admin") {
      setView("admin");
    } else if (currentUser.userName !== "") {
      setView("profile");
    } else {
      setView("");
    }
  }, [currentUser, users]);

  const mainChildren = document.querySelectorAll(".main > *");

  mainChildren.forEach((child) => {
    child.classList.add("visible");
  });

  // Render the main component
  return (
    <>
      <header>
        <h1>ניהול משתמשים</h1>
        <br />
        <p>ברוך הבא, {currentUser.userName}</p>
      </header>
      <div className="main">
        {/* Registration component */}
        <FCRegister
          users={users}
          setUsers={setUsers}
          setError={setError}
          error={error}
        />
        {/* Login component */}
        <FCLogin />
        {/* Display System Admin component if the current user is an admin */}
        {view === "admin" && <FCSystemAdmin users={users} />}
        {/* Display User Profile component if the current user is logged in */}
        {view === "profile" && <FCProfile currentUser={currentUser} />}
      </div>
    </>
  );
}

export default App;
