import { db } from "@/db";
import { Photo } from "@/entities/photo.entity";

export const photoRepository = db.getRepository(Photo);
