import { authController } from "@/controllers/auth.controller";
import { CreateUserDto } from "@/dto/createUser.dto";
import { LoginUserDto } from "@/dto/loginUser.dto";
import validateDto from "@/middlewares/validateDto.middleware";
import { Router } from "express";

const router = Router();

router.post("/login", validateDto(LoginUserDto), authController.login);
router.get("/token", authController.token);
router.delete("/logout", authController.logout);
router.post("/register", validateDto(CreateUserDto), authController.register);

export default router;
