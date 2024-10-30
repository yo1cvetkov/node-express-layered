import { BadRequestError } from "@/errors/BadRequestError";
import { NotFoundError } from "@/errors/NotFoundError";
import { UserService } from "@/services/user.service";
import { generateAccessToken } from "@/utils/auth";
import { instanceToPlain } from "class-transformer";
import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

let refreshTokens: string[] = []; // bad in production use Redis instead

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findUser = await UserService.findUser(req.body);

      const accessToken = generateAccessToken(instanceToPlain(findUser));

      const refreshToken = jwt.sign(instanceToPlain(findUser), process.env.REFRESH_TOKEN_SECRET!);

      refreshTokens.push(refreshToken);
      res.json({ accessToken, refreshToken });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }

      if (error instanceof BadRequestError) {
        res.status(400).json({ message: error.message });
        return;
      }

      next(error);
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const newUser = await UserService.createUser(req.body);

      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  },

  token: (req: Request, res: Response) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      res.status(401);
      return;
    }

    if (!refreshTokens.includes(refreshToken)) {
      res.status(403);
      return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
      if (err) {
        res.sendStatus(403);
      }

      const accessToken = generateAccessToken(user);

      res.json({ accessToken });
    });
  },

  logout: (req: Request, res: Response) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

    res.sendStatus(204);
  },
};
