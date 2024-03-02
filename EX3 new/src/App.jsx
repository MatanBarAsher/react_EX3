import { useState, useEffect, useMemo } from "react";
import "./App.css";
import { FCProfile, FCSystemAdmin, FCLogin, FCRegister } from "./Components";
import { PROFILE_PROPS } from "./constants";

function App() {
  // State for user data, error messages, user list, current user, and view
  const [error, setError] = useState("");
  const [users, setUsers] = useState(() => {
    // Load users from local storage or initialize an empty array
    const storedUsers = [JSON.parse(localStorage.getItem("users"))].flat();
    console.log("Stored Users:", storedUsers);
    return storedUsers ?? [];
  });
  const currentUser = useMemo(() => {
    // Load current user from local storage or initialize an empty user object
    const localValue = JSON.parse(localStorage.getItem("current-user"));
    return localValue?.userName ? localValue : PROFILE_PROPS;
  }, []);

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
        {currentUser.userName && <p>ברוך הבא, {currentUser.userName}</p>}
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
