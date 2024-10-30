import { CreateUserDto } from "@/dto/createUser.dto";
import { User } from "@/entities/user.entity";
import { UserRepository } from "@/repositories/user.repository";
import { validate } from "class-validator";
import bcrypt from "bcrypt";

interface UserService {
  getAllUsers: () => Promise<Partial<User>[]>;
  createUser: (payload: CreateUserDto) => Promise<User>;
}

export const UserService: UserService = {
  getAllUsers: async () => {
    const users = await UserRepository.find();

    return users.map((user) => {
      const { password, ...plainUser } = user;

      return plainUser;
    });
  },

  createUser: async (payload: CreateUserDto) => {
    const newUser = new User();
    newUser.firstName = payload.firstName;
    newUser.lastName = payload.lastName;
    newUser.username = payload.username;
    newUser.password = payload.password;

    try {
      const errors = await validate(newUser);

      if (errors.length > 0) {
        const messages = errors.map((error) => Object.values(error.constraints || {}).join("\n"));
        throw new Error(messages.toString());
      }

      const hashedPassword = await bcrypt.hash(newUser.password as string, 10);

      newUser.password = hashedPassword;

      return await UserRepository.save(newUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Oops");
      }
    }
  },
};
