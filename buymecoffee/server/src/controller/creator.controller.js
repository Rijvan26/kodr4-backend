import { appError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { findCreatorProfileById, updateCreatorProfileById, } from "../DAO/creator.dao.js";
import { findPublicCreatorByUsername } from "../DAO/creator.dao.js";
function toCreatorProfile(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio ?? "",
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}
function toPublicCreator(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        bio: user.bio ?? "",
        avatarUrl: user.avatarUrl,
    };
}
function getAuthenticatedUserId(request) {
    if (!request.user) {
        throw new appError("Authentication required", 401);
    }
    return request.user._id.toString();
}
export const getCreatorProfile = asyncHandler(async (request, response) => {
    const userId = getAuthenticatedUserId(request);
    const user = await findCreatorProfileById(userId);
    if (!user) {
        throw new appError("Creator profile not found", 404);
    }
    sendSuccess(response, 200, "Creator profile fetched", {
        creator: toCreatorProfile(user),
    });
});
export const updateCreatorProfile = asyncHandler(async (request, response) => {
    const userId = getAuthenticatedUserId(request);
    const profileUpdates = {};
    if (request.body.name !== undefined) {
        profileUpdates.name = request.body.name;
    }
    if (request.body.bio !== undefined) {
        profileUpdates.bio = request.body.bio;
    }
    if (request.body.avatarUrl !== undefined) {
        profileUpdates.avatarUrl = request.body.avatarUrl;
    }
    const user = await updateCreatorProfileById(userId, profileUpdates);
    if (!user) {
        throw new appError("Creator profile not found", 404);
    }
    sendSuccess(response, 200, "Creator profile updated", {
        creator: toCreatorProfile(user),
    });
});
export const getPublicCreator = asyncHandler(async (request, response) => {
    const username = request.params.username;
    if (typeof username !== "string" || !username.trim()) {
        throw new appError("Creator not found", 404);
    }
    const creator = await findPublicCreatorByUsername(username);
    if (!creator) {
        throw new appError("Creator not found", 404);
    }
    sendSuccess(response, 200, "Creator fetched", {
        creator: toPublicCreator(creator),
    });
});
//# sourceMappingURL=creator.controller.js.map