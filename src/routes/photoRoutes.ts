import { photoController } from "@/controllers/photo.controller";
import { CreatePhotoDto } from "@/dto/createPhoto.dto";
import validateDto from "@/middlewares/validateDto.middleware";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", photoController.getPhotos);
router.get("/:id", photoController.getPhoto);
router.post("/", photoController.createPhoto);

export default router;
