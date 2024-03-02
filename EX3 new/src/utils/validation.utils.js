// Validation function to check user input
export const validationCheck = (
  form,
  users,
  isImageChange = true,
  editMail
) => {
  const userForm = new FormData(form);
  const userData = Object.fromEntries(userForm);

  const errors = {};

  // Validate userName
  if (
    !/^[a-zA-Z0-9!@#$%^&*()-_+=~`[\]{}|;:'",.<>?/\\]+$/g.test(userData.userName)
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
  if (isImageChange) {
    const fileName = userData.image.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    // Check if the file extension is either 'jpg' or 'jpeg'
    if (fileExtension !== "jpg" && fileExtension !== "jpeg") {
      errors.image = "ניתן להעלות קבצי jpg או jpeg בלבד.";
    }
  }

  // Validate firstName and lastName
  if (!/^[א-ת\s]+$/g.test(userData.firstName)) {
    errors.firstName = "שם פרטי יכול להכיל טקסט בלבד.";
  }
  if (!/^[א-ת\s]+$/g.test(userData.lastName)) {
    errors.lastName = "שם משפחה יכול להכיל טקסט בלבד.";
  }

  // Validate email
  if (!editMail) {
    const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9._-]*@[a-zA-Z]+\.[a-zA-Z]{2,5}$/;
    if (!emailRegex.test(userData.email)) {
      errors.email = "כתובת מייל אינה חוקית.";
    }
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

  if (!checkIfExist(userData.userName, editMail ?? userData.email, users, !!editMail)) {
    errors.avalible = "דוא''ל או שם משתמש כבר בשימוש.";
  }

  return errors;
};

function checkIfExist(userName, email, users, isEdit) {
  const check = [];
  users.forEach((user) => {
    if (
      isEdit
        ? user.userName === userName && user.email !== email
        : user.userName === userName || user.email === email
    )
      check.push(user);
  });
  if (!check.length) {
    return true;
  }
  return false;
}

// Function to check if user name and email are available
// function checkIfExist(userName, email, users) {
//   const user = users.find(
//     () => user.userName === userName || user.email === email
//   );
//   return !!user;
// }
