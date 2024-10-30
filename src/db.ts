import "reflect-metadata";
import { DataSource } from "typeorm";
import { Photo } from "./entities/photo.entity";
import { PhotoMetadata } from "./entities/photoMetadata.entity";
import { Author } from "./entities/author.entity";
import { Album } from "./entities/album.entity";

export const db = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "test",
  synchronize: true, // false in prod
  logging: false,
  entities: [Photo, PhotoMetadata, Author, Album],
  migrations: ["src/migrations/*.ts"],
});
