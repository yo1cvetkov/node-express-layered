import { CreatePhotoDto } from "@/dto/createPhoto.dto";
import { Photo } from "@/entities/photo.entity";
import { PhotoMetadata } from "@/entities/photoMetadata.entity";
import { photoRepository } from "@/repositories/photo.repository";
import { validate } from "class-validator";

interface PhotoService {
  getAllPhotos: () => Promise<Photo[]>;
  getPhotoById: (id: string) => Promise<Photo>;
  getAllPublishedPhotos: () => Promise<Photo[]>;
  createPhoto: (props: CreatePhotoDto) => Promise<Photo>;
}

export const PhotoService: PhotoService = {
  getAllPhotos: async () => {
    const photos = await photoRepository.find({
      // relations: {
      //   metadata: true,
      // },
    });

    return photos;
  },

  getPhotoById: async (id) => {
    const photo = await photoRepository.findOneBy({
      id,
    });

    if (!photo) {
      throw new Error("Photo not found");
    }

    return photo;
  },

  getAllPublishedPhotos: async () => {
    const photos = await photoRepository.findBy({
      isPublished: true,
    });

    return photos;
  },

  createPhoto: async ({ name, description, filename, isPublished, views }: CreatePhotoDto) => {
    const newPhoto = new Photo();

    newPhoto.name = name;
    newPhoto.description = description;
    newPhoto.filename = filename;
    newPhoto.isPublished = isPublished;
    newPhoto.views = views;

    const errors = await validate(newPhoto);

    if (errors.length > 0) {
      const messages = errors.map((error) => Object.values(error.constraints || {}).join("\n"));
      throw new Error(messages.toString());
    }

    return await photoRepository.save(newPhoto);
  },
};
