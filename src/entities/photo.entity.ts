import { Entity, Column, PrimaryGeneratedColumn, OneToOne, Relation, ManyToOne, CreateDateColumn } from "typeorm";
import { PhotoMetadata } from "./photoMetadata.entity";
import { Author } from "./author.entity";
import { Album } from "./album.entity";

import { IsString, Min, Max, Length, Contains, IsInt, IsBoolean, MinLength, MaxLength } from "class-validator";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    unique: true,
  })
  // @IsString()
  // @MinLength(5, {
  //   message: "Name is too short. Minimal length is $constraint1 characters",
  // })
  // @MaxLength(20, {
  //   message: "Name is too long. Maximal length is $constraint1 characters.",
  // })
  name?: string;

  @Column()
  // @IsString()
  // @Length(10, 50)
  description?: string;

  @Column()
  // @IsString()
  // @Contains(".")
  filename?: string;

  @Column()
  // @IsInt()
  // @Min(0)
  // @Max(1000)
  views?: number;

  @Column()
  // @IsBoolean()
  isPublished?: boolean;

  // @OneToOne(() => PhotoMetadata, (photoMetadata) => photoMetadata.photo, {
  //   cascade: true,
  // })
  // metadata?: Relation<PhotoMetadata>;

  @ManyToOne(() => Author, (author) => author.photos)
  author?: Relation<Author>;

  @ManyToOne(() => Album, (album) => album.photos)
  albums?: Relation<Album[]>;

  @CreateDateColumn()
  createdAt?: Date;
}
