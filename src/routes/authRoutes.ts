import { authController } from '@/controllers/auth.controller';
import { CreateUserDto } from '@/dto/createUser.dto';
import { LoginUserDto } from '@/dto/loginUser.dto';
import validateDto from '@/middlewares/validateDto.middleware';
import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user to the app
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateDto(LoginUserDto), authController.login);

/**
 * @swagger
 * components:
 *  schemas:
 *    TokenInput:
 *      type: object
 *      required:
 *        - token
 *      properties:
 *        token:
 *          type: string
 *
 */

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Get new access token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenInput'
 *     responses:
 *       200:
 *         description: Access token successfully generated
 *       401:
 *         description: No refresh token present on body
 *       403:
 *         description: Refresh token expired or invalid
 */
router.get('/token', authController.token);
/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     responses:
 *       204:
 *         description: User successfully logged out
 */
router.delete('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Some fields are missing
 */
router.post('/register', validateDto(CreateUserDto), authController.register);

export default router;
