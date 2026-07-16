import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

async function userAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const isTokenValid = await jwt.verify(token, process.env.JWT_SECRET);
    if (!isTokenValid) {
      return res.status(401).send("Unauthorized");
    }
    const userId = isTokenValid._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    req.user = user; // Attach the user object to the request for further use
    next();
  } catch (error) {
    res.status(500).send("Something Went Wrong!!");
  }
}

export { userAuth };
