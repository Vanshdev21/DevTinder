import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./model/User.model.js";

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, age, email, password, gender } = req.body;
  const user = new User({ firstName, lastName, age, email, password, gender });
  try {
    await user.save();
    res.send("User Saved");
  } catch (error) {
    res.send(error);
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

app.patch("/api/user/patch", async (req, res) => {
  const { email, firstName, lastName, age, userId } = req.body;
  try {
    console.log("userId", firstName, lastName, age, userId);
    await User.findOneAndUpdate(
      { email: email },
      {
        firstName,
        lastName,
        age,
        // new: true, // This option returns the updated document
        //
      },
    );
    res.status(200).send("User is updated");
  } catch (error) {
    res.status(500).send("Something Went Wrong!!");
  }
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
