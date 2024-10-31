import { UserService } from '../services/user.service';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../entities/user.entity';
import { LoginUserDto } from '@/dto/loginUser.dto';
import { NotFoundError } from '@/errors/NotFoundError';

import bcrypt from 'bcrypt';
import { BadRequestError } from '@/errors/BadRequestError';
import { CreateUserDto } from '@/dto/createUser.dto';

jest.mock('../repositories/user.repository', () => ({
  UserRepository: {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UserService', () => {
  describe('getAllUsers method', () => {
    it('should return list of all users without password', async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'user1',
          password: 'pass1',
          firstName: 'fn1',
          lastName: 'ln1',
        },
        {
          id: '2',
          username: 'user2',
          password: 'pass2',
          firstName: 'fn2',
          lastName: 'ln2',
        },
      ];

      (UserRepository.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await UserService.getAllUsers();

      expect(result).toEqual([
        {
          id: '1',
          username: 'user1',
          firstName: 'fn1',
          lastName: 'ln1',
        },
        {
          id: '2',
          username: 'user2',
          firstName: 'fn2',
          lastName: 'ln2',
        },
      ]);

      expect(UserRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUser method', () => {
    const mockUser = {
      id: '1',
      username: 'testUser',
      password: 'hashedPassword123',
    };

    const validPayload: LoginUserDto = {
      username: 'testUser',
      password: 'password123',
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw NotFoundError if user is not found', async () => {
      (UserRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(UserService.findUser(validPayload)).rejects.toThrow(
        NotFoundError
      );

      expect(UserRepository.findOne).toHaveBeenCalledWith({
        where: {
          username: validPayload.username,
        },
      });
    });

    it('should throw BadRequestError if password does not match', async () => {
      (UserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(UserService.findUser(validPayload)).rejects.toThrow(
        BadRequestError
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        validPayload.password,
        mockUser.password
      );
    });

    it('should return user data without password if password matches', async () => {
      (UserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await UserService.findUser(validPayload);

      expect(result).toEqual({ id: mockUser.id, username: mockUser.username });

      expect(UserRepository.findOne).toHaveBeenCalledWith({
        where: {
          username: validPayload.username,
        },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        validPayload.password,
        mockUser.password
      );
    });
  });

  describe('createUser method', () => {
    const mockPayload: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should hash the password and save the user', async () => {
      const mockHashedPassword = 'hashedPassword123';
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: mockHashedPassword,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (UserRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.createUser(mockPayload);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockPayload.password, 10);

      expect(UserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: mockPayload.firstName,
          lastName: mockPayload.lastName,
          username: mockPayload.username,
          password: mockHashedPassword,
        })
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if bcrypt.hash fails', async () => {
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

      await expect(UserService.createUser(mockPayload)).rejects.toThrow(
        'Hashing failed'
      );

      expect(UserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw generic error is UserRepository.save fails', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

      (UserRepository.save as jest.Mock).mockRejectedValue(
        new Error('Save failed')
      );

      await expect(UserService.createUser(mockPayload)).rejects.toThrow(
        'Save failed'
      );

      expect(UserRepository.save).toHaveBeenCalled();
    });
  });
});
