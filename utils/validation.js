import validator from "validator";

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !email || !password) {
    throw new Error("Missing required fields");
  } else if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("First name must be between 3 and 30 characters");
  } else if (lastName && (lastName.length < 3 || lastName.length > 30)) {
    throw new Error("Last name must be between 3 and 30 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol",
    );
  }
};

export { validateSignUpData };
