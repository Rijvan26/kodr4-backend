import { UserModel } from "../models/user.model.js";
import type { UpdateCreatorProfileRequest } from "../types/creator.types.js";

export function findCreatorProfileById(userId: string) {
  return UserModel.findById(userId);
}

export function findPublicCreatorByUsername(username: string) {
  return UserModel.findOne({ username: username.trim().toLowerCase() }).select(
    "name username bio avatarUrl coffeePrice socialLinks goal",
  );
}

export function updateCreatorProfileById(
  userId: string,
  profileUpdates: UpdateCreatorProfileRequest,
) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: profileUpdates },
    { returnDocument: "after", runValidators: true },
  );
}
