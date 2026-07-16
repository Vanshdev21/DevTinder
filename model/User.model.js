import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
        return validator.isEmail(value);
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate(value) {
        if (
          !validator.isStrongPassword(value, {
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
        return validator.isStrongPassword(value, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
    },
    gender: {
      type: String,
      validate(value) {
        const allowedGenders = ["male", "female", "other"];
        if (!allowedGenders.includes(value)) {
          throw new Error("Invalid gender value");
        }
        return allowedGenders.includes(value);
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoURL: {
      type: String,
      default:
        "https://hostalitecloud.com/crb/wp-content/uploads/2025/10/dummy-user-male.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
        return validator.isURL(value);
      },
    },
    bio: {
      type: String,
    },
    skills: {
      type: [String],
      validate(value) {
        if (!Array.isArray(value)) {
          throw new Error("Skills must be an array of strings");
        }
        if (value.length > 5) {
          throw new Error("You can add a maximum of 5 skills");
        }
      },
    },
  },
  { timestamps: true },
);

userSchema.method.JWTToken = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expiration time
  });
  return token;
};

userSchema.method.validatePassword = async function (password) {
  const hashedPassword = await bcrypt.compare(password, this.password);
  return hashedPassword;
};

const User = mongoose.model("User", userSchema);

export default User;
