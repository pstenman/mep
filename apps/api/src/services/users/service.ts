import { userQueries, db, type Database } from "@mep/db";
import type { CreateUserSchema } from "./schema";

export class UserService {
  static async create(input: CreateUserSchema, executor?: Database) {
    return await userQueries.create(input, executor ?? db);
  }
}