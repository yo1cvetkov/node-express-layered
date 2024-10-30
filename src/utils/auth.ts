import { User } from "@/types/User";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: User) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15s" });
};