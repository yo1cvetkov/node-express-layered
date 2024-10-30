import { db } from "@/db";
import { User } from "@/entities/user.entity";

export const UserRepository = db.getRepository(User);
