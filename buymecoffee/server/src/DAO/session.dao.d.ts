/**
 * Gets the session by token.
 * @param token The raw refresh token
 */
export declare function getSessionByToken(token: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/session.model.js").ISession, {}, import("mongoose").DefaultSchemaOptions> & import("../models/session.model.js").ISession & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
/**
 * Persists a new refresh token for the user.
 * @param id The user's database ID
 * @param refreshToken The raw refresh token
 */
export declare function updateRefreshToken(id: string, refreshToken: string): Promise<import("mongoose").Document<unknown, {}, import("../models/session.model.js").ISession, {}, import("mongoose").DefaultSchemaOptions> & import("../models/session.model.js").ISession & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
/**
 * Clears the stored refresh token for the user.
 * @param token The raw refresh token
 */
export declare function clearRefreshToken(token: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/session.model.js").ISession, {}, import("mongoose").DefaultSchemaOptions> & import("../models/session.model.js").ISession & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
//# sourceMappingURL=session.dao.d.ts.map