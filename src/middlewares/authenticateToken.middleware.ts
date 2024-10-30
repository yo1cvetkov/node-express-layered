import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface RequestWithUser extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers["authorization"];

  const token = bearer?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    (req as RequestWithUser).user = user;

    next();
  });
};
