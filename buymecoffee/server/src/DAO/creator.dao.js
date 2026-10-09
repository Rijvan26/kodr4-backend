import { UserModel } from "../models/user.model.js";
export function findCreatorProfileById(userId) {
    return UserModel.findById(userId);
}
export function findPublicCreatorByUsername(username) {
    return UserModel.findOne({ username: username.trim().toLowerCase() }).select("name username bio avatarUrl");
}
export function updateCreatorProfileById(userId, profileUpdates) {
    return UserModel.findByIdAndUpdate(userId, { $set: profileUpdates }, { returnDocument: "after", runValidators: true });
}
//# sourceMappingURL=creator.dao.js.map