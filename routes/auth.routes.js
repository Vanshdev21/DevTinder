import express from "express";
import bcrypt from "bcrypt";
import User from "../model/User.model.js";
import { validateSignUpData } from "../utils/validation.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logout successful");
});

export default router;
