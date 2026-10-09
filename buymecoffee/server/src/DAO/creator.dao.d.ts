import type { UpdateCreatorProfileRequest } from "../types/creator.types.js";
export declare function findCreatorProfileById(userId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>) | null, import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {}, import("../models/user.model.js").Iuser, "findOne", {
    id: string;
}>;
export declare function findPublicCreatorByUsername(username: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>) | null, import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {}, import("../models/user.model.js").Iuser, "findOne", {
    id: string;
}>;
export declare function updateCreatorProfileById(userId: string, profileUpdates: UpdateCreatorProfileRequest): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>) | null, import("mongoose").Document<unknown, {}, import("../models/user.model.js").Iuser, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<import("../models/user.model.js").Iuser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {}, import("../models/user.model.js").Iuser, "findOneAndUpdate", {
    id: string;
}>;
//# sourceMappingURL=creator.dao.d.ts.map