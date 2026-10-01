import type { RegisterInput } from "../types/user.js";
/**
 * Creates and persists a new user (password is hashed by the model hook).
 * @param input The user registration data
 */
export declare function createUser(input: RegisterInput): Promise<import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>>;
/**
 * Finds a user by email, including the password hash.
 * @param email The user's email address
 */
export declare function findUserByEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>) | null>;
/**
 * Finds a user by id.
 * @param id The user's database ID
 */
export declare function findUserById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>) | null>;
//# sourceMappingURL=user.dao.d.ts.map