import { UserModel } from "../models/user.model.js";
/**
 * Creates and persists a new user (password is hashed by the model hook).
 * @param input The user registration data
 */
export async function createUser(input) {
    return UserModel.create(input);
}
/**
 * Finds a user by email, including the password hash.
 * @param email The user's email address
 */
export async function findUserByEmail(email) {
    return UserModel.findOne({ email: email.toLowerCase() }).select("+password");
}
/**
 * Finds a user by id.
 * @param id The user's database ID
 */
export async function findUserById(id) {
    return UserModel.findById(id);
}
//# sourceMappingURL=user.dao.js.map