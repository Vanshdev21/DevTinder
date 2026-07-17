import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./model/User.model.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { userAuth } from "./middlewares/auth.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

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
    const isPasswordValid = await user.validatePassword(password);

    console.log("isPasswordValid:", isPasswordValid);
    if (isPasswordValid) {
      // Create JWT token and send it in the response
      const token = await user.JWTToken();
      // ADD token to cookies or headers for authentication in future requests

      res.cookie("token", token);

      res.status(200).send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).send("Something Went Wrong!!", error);
  }
});

app.get("/api/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Access the authenticated user from the request
    res.status(200).send(user);
  } catch (error) {
    console.log("Error fetching profile:", error);
    res.status(500).send("Something Went Wrong!!", error);
  }
});

app.post("/api/sendConnectionRequest", userAuth, (req, res) => {
  res.send(`Connection request sent ${req.user}`);
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
