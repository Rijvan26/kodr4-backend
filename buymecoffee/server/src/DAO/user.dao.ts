import { UserModel } from "../models/user.model.js";
import type { RegisterInput, User } from "../types/user.js"; // Import both types here

/**
 * Creates and persists a new user (password is hashed by the model hook).
 * @param input The user registration data
 */
export async function createUser(input: RegisterInput) {
    return UserModel.create(input);
}

/**
 * Finds a user by email, including the password hash.
 * @param email The user's email address
 */
export async function findUserByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+password");
}

/**
 * Finds a user by id.
 * @param id The user's database ID
 */
export async function findUserById(id: string) {
    return UserModel.findById(id);
}