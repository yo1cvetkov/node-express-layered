import { db } from "@/data-source";
import { PhotoMetadata } from "@/entities/photoMetadata.entity";

export const photoMetadataRepository = db.getRepository(PhotoMetadata);
