import { User } from '@/entities/user.entity';
import jwt from 'jsonwebtoken';
import redisClient from './redisConfig';

export const generateAccessToken = (user: User) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10m' });
};

export const generateAndStoreRefreshToken = async (user: User) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });

  await redisClient.set(`refreshToken:${user.id}`, refreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  return refreshToken;
};
