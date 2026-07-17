import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./model/User.model.js";
import cookieParser from "cookie-parser";
import { userAuth } from "./middlewares/auth.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/users", userRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
