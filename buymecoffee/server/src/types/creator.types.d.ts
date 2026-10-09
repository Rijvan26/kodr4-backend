export interface CreatorProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}
export interface UpdateCreatorProfileRequest {
    name?: string;
    bio?: string;
    avatarUrl?: string;
}
export interface CreatorProfileResponse {
    success: true;
    message: string;
    data: {
        creator: CreatorProfile;
    };
}
export interface PublicCreator {
    id: string;
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
}
//# sourceMappingURL=creator.types.d.ts.map