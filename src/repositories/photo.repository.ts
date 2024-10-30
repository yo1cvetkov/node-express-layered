import { db } from "@/data-source";
import { Photo } from "@/entities/photo.entity";

export const photoRepository = db.getRepository(Photo);
