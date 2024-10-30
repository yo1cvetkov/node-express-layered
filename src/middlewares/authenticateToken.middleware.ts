import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface RequestWithUser extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers["authorization"];

  const token = bearer?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    (req as RequestWithUser).user = user;

    next();
  });
};
