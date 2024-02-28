import { useState } from "react";
import FCEdit from "./FCEdit";

const FCSystemAdmin = () => {
  const [users, setUsers] = useState(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    console.log("Stored Users:", storedUsers);
    if (storedUsers) {
      return storedUsers;
    }
    return [];
  });
  const [ToShow, setToShow] = useState(false);
  const [UserToEdit, setUserToEdit] = useState(null);
  function Users({ list }) {
    let usersTr = [];

    list.forEach((user) => {
      usersTr.push(
        <tr key={user.email}>
          <td>{user.userName}</td>
          <td>
            {user.firstName} {user.lastName}
          </td>
          <td>{user.dateOfBirth}</td>
          <td>
            {user.street} {user.number}, {user.city}
          </td>
          <td>{user.email}</td>
          <td>
            <button className="btnEdit" onClick={() => handleEdit(user)}>
              ✏️
            </button>
            <button
              className="btnDelete"
              onClick={() => handleDelete(user.email)}
            >
              ❌
            </button>
          </td>
        </tr>
      );
    });

    return usersTr;
  }
  function handleEdit(user) {
    setUserToEdit(user);
    setToShow(true);
  }

  function handleDelete(email) {
    const temp = users.filter((user) => user.email !== email);
    localStorage.setItem("users", JSON.stringify(temp));
    setUsers(temp);
  }

  const closeModal = () => {
    setUserToEdit(null);
    setToShow(false);
  };

  return (
    <>
      <table id="admin-table">
        <tbody>
          <tr>
            <th>שם משתמש</th>
            <th>שם מלא</th>
            <th>תאריך לידה</th>
            <th>כתובת</th>
            <th>דואר אלקטרוני</th>
            <th></th>
          </tr>
          <Users list={users} />
        </tbody>
      </table>
      <FCEdit userToEdit={UserToEdit} toShow={ToShow} onClose={closeModal} />
    </>
  );
};

export default FCSystemAdmin;
