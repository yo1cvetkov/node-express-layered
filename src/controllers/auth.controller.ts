import { User } from '@/entities/user.entity';
import { BadRequestError } from '@/errors/BadRequestError';
import { NotFoundError } from '@/errors/NotFoundError';
import { RequestWithUser } from '@/middlewares/authenticateToken.middleware';
import { UserService } from '@/services/user.service';
import {
  generateAccessToken,
  generateAndStoreRefreshToken,
} from '@/utils/auth';
import redisClient from '@/utils/redisConfig';
import { instanceToPlain } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findUser = await UserService.findUser(req.body);

      const accessToken = generateAccessToken(instanceToPlain(findUser));

      const refreshToken = await generateAndStoreRefreshToken(
        instanceToPlain(findUser)
      );
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

  token: async (req: Request, res: Response) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      res.status(401);
      return;
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as User;

      const storedToken = await redisClient.get(`refreshToken:${payload.id}`);

      if (storedToken !== refreshToken) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
        return;
      }

      const accessToken = generateAccessToken(payload);

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(403).json({ message: 'Invalid refresh token' });
    }
  },

  logout: async (req: RequestWithUser, res: Response) => {
    const user = req.user as User;

    await redisClient.del(`refreshToken: ${user.id}`);

    res.sendStatus(204);
  },
};
