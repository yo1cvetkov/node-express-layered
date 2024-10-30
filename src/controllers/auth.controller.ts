import { CreateUserDto } from "@/dto/createUser.dto";
import { UserService } from "@/services/user.service";
import { User } from "@/types/User";
import { generateAccessToken } from "@/utils/auth";
import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";

import jwt, { VerifyOptions } from "jsonwebtoken";

let refreshTokens: string[] = []; // bad in production use Redis instead

export const authController = {
  login: (req: Request, res: Response) => {
    const username = req.body.username;

    const user: User = {
      username,
    };

    const accessToken = generateAccessToken(user);

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  },

  register: async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateUserDto, req.body);

    try {
      const newUser = await UserService.createUser(dto);

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

      const accessToken = generateAccessToken({ username: user.username });

      res.json({ accessToken });
    });
  },

  logout: (req: Request, res: Response) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

    res.sendStatus(204);
  },
};
