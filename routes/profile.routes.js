import express from "express";
import { userAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // Access the authenticated user from the request
    res.status(200).send(user);
  } catch (error) {
    console.log("Error fetching profile:", error);
    res.status(500).send("Something Went Wrong!!", error);
  }
});

export default router;
