import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./model/User.model.js";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/users", async (req, res) => {
  const { firstName, lastName, age, email, password, gender } = req.body;
  const user = new User({ firstName, lastName, age, email, password, gender });
  try {
    await user.save();
    res.send("User Saved");
  } catch (error) {
    res.send(error);
  }
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
