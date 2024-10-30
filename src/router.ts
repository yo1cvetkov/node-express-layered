import { Router } from "express";
import photoRoutes from "@/routes/photoRoutes";

const router = Router();

// Photo routes

router.use("/photo", photoRoutes);

export default router;
