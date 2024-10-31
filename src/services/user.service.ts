import { CreateUserDto } from '@/dto/createUser.dto';
import { User } from '@/entities/user.entity';
import { UserRepository } from '@/repositories/user.repository';
import bcrypt from 'bcrypt';
import { LoginUserDto } from '@/dto/loginUser.dto';
import { NotFoundError } from '@/errors/NotFoundError';
import { BadRequestError } from '@/errors/BadRequestError';

interface UserService {
  getAllUsers: () => Promise<Partial<User>[]>;
  createUser: (payload: CreateUserDto) => Promise<User>;
  findUser: (payload: LoginUserDto) => Promise<User>;
}

export const UserService: UserService = {
  getAllUsers: async () => {
    const users = await UserRepository.find();

    return users.map((user) => {
      const { password, ...plainUser } = user;

      return plainUser;
    });
  },

  findUser: async (payload: LoginUserDto) => {
    const findUser = await UserRepository.findOne({
      where: {
        username: payload.username,
      },
    });

    if (!findUser) {
      throw new NotFoundError("User with given username doesn't exist.");
    }

    if (
      await bcrypt.compare(
        payload.password as string,
        findUser.password as string
      )
    ) {
      const { password, ...userData } = findUser;

      return userData;
    } else {
      throw new BadRequestError('Password is not correct');
    }
  },

  createUser: async (payload: CreateUserDto) => {
    try {
      const hashedPassword = await bcrypt.hash(payload.password as string, 10);

      const newUser = new User();

      newUser.firstName = payload.firstName;
      newUser.lastName = payload.lastName;
      newUser.username = payload.username;
      newUser.password = hashedPassword;

      return await UserRepository.save(newUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Oops');
      }
    }
  },
};
