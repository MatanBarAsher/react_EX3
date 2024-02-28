import { useState, useEffect } from "react";
import "./App.css";
import FCLogin from "./Components/FCLogin";
import FCProfile from "./Components/FCProfile";
import FCSystemAdmin from "./Components/FCSystemAdmin";
import FCRegister from "./Components/FCRegister";

function App() {
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
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    console.log("Stored Users:", storedUsers);
    if (storedUsers) {
      return storedUsers;
    }
    return [];
  });
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
    if (users?.length !== 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  function ViewProfileOrAdmin() {
    if (currentUser.userName === "admin") {
      return <FCSystemAdmin users={users} />;
    } else if (currentUser.userName !== "") {
      return <FCProfile currentUser={currentUser} />;
    }
  }

  return (
    <>
      <header>
        <h1>ניהול משתמשים</h1>
        <br />
        <p>ברוך הבא, {currentUser.userName}</p>
      </header>
      <div className="main">
        <FCRegister
          users={users}
          setUsers={setUsers}
          setError={setError}
          error={error}
        />
        <FCLogin />
        <ViewProfileOrAdmin />
      </div>
    </>
  );
}

export default App;
