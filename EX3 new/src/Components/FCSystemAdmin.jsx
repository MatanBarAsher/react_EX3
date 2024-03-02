import { useState } from "react";
import { FCEdit } from "./FCEdit";

export const FCSystemAdmin = () => {
  // State for user list, modal visibility, and user to edit
  const [users, setUsers] = useState(() => {
    const storedUsers = [JSON.parse(localStorage.getItem("users"))].flat();
    console.log("Stored Users:", storedUsers);
    return storedUsers ?? [];
  });

  const [show, setShow] = useState(false);
  const [UserToEdit, setUserToEdit] = useState(null);

  // Function to render user rows in the table
  function Users({ list }) {
    const usersTr = [];

    list.forEach((user) => {
      if (user.firstName !== "") {
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
      }
    });

    return usersTr;
  }

  // Function to handle the edit button click
  function handleEdit(user) {
    setUserToEdit(user);
    setShow(true);
  }

  // Function to handle the delete button click
  function handleDelete(email) {
    const temp = users.filter((user) => user.email !== email);
    localStorage.setItem("users", JSON.stringify(temp));
    setUsers(temp);
  }

  // Function to close the edit modal
  const closeModal = () => {
    setUserToEdit(null);
    setShow(false);
  };

  // Render the table and the edit modal
  return (
    <>
      <table id="admin-table" className="visible">
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
      <FCEdit userToEdit={UserToEdit} show={show} onClose={closeModal} />
    </>
  );
};
