import { CreatePhotoDto } from "@/dto/createPhoto.dto";
import { PhotoService } from "@/services/photo.service";
import { plainToInstance } from "class-transformer";
import { Request, Response } from "express";

export const photoController = {
  getPhotos: async (req: Request, res: Response) => {
    try {
      const photos = await PhotoService.getAllPhotos();

      res.json(photos);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  },

  getPhoto: async (req: Request, res: Response) => {
    try {
      const photo = await PhotoService.getPhotoById(req.params.id as string);

      res.json(photo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      }
    }
  },

  createPhoto: async (req: Request, res: Response) => {
    const dto = plainToInstance(CreatePhotoDto, req.body);

    try {
      const photo = await PhotoService.createPhoto(dto);

      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  },
};
