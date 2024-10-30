import { authController } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/login", authController.login);
router.get("/token", authController.token);
router.delete("/logout", authController.logout);
router.post("/register", authController.register);

export default router;
