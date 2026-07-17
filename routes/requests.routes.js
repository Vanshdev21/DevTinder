import express from "express";
import { userAuth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/send/interested/:userId", userAuth, (req, res) => {
  res.send(`Connection request sent ${req.user}`);
});

export default router;
