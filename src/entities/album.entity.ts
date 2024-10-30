import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Relation } from "typeorm";
import { Photo } from "./photo.entity";

@Entity()
export class Album {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @ManyToMany(() => Photo, (photo) => photo.albums)
  @JoinTable()
  photos!: Relation<Photo[]>;
}
