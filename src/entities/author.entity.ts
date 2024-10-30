import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Relation } from "typeorm";

import { Photo } from "./photo.entity";

@Entity()
export class Author {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => Photo, (photo) => photo.author)
  photos!: Relation<Photo[]>;
}
