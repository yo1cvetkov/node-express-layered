import { db } from "@/db";
import { PhotoMetadata } from "@/entities/photoMetadata.entity";

export const photoMetadataRepository = db.getRepository(PhotoMetadata);
