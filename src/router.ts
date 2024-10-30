import { Router } from "express";
import photoRoutes from "@/routes/photoRoutes";
import authRoutes from "@/routes/authRoutes";
import { authenticateToken } from "./middlewares/authenticateToken.middleware";

const router = Router();

// Photo routes

router.use("/photo", authenticateToken, photoRoutes);

// Auth routes

router.use("/auth", authRoutes);

export default router;
