import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./model/User.model.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/signup", async (req, res) => {
  try {
    // Validation the req data
    validateSignUpData(req);
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { firstName, lastName, email } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("User Saved");
  } catch (error) {
    res.send(error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    }
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(500).send("Something Went Wrong!!");
  }
});

app.get("/api/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Something Went Wrong!!");
  }
});

app.delete("/api/user/delete", async (req, res) => {
  const { userId } = req.body;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.status(200).send("User is deleted");
  } catch (error) {
    res.status(500).send("Something Went Wrong!!");
  }
});

app.patch("/api/user/patch/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const data = req.body;
    const ALLOWED_FIELDS = ["age", "gender", "skills", "photoURL", "bio"];
    const updates = Object.keys(data);
    const isValidOperation = updates.every((update) =>
      ALLOWED_FIELDS.includes(update),
    );

    if (!isValidOperation) {
      throw new Error("Invalid updates!");
    }

    const { age, gender, skills, photoURL, bio } = req.body;
    await User.findByIdAndUpdate(
      userId,
      {
        age,
        gender,
        skills,
        photoURL,
        bio,
        // new: true, // This option returns the updated document
        //
      },
      {
        runValidators: true, // This option ensures that the update operation respects the schema validators
      },
    );
    res.status(200).send("User is updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
