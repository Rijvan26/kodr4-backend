export interface CreatorSocialLinks {
  instagram?: string | undefined;
  youtube?: string | undefined;
  twitter?: string | undefined;
  website?: string | undefined;
}

export interface CreatorGoal {
  title?: string | undefined;
  targetAmount?: number | undefined;
  showGoal?: boolean | undefined;
}

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  coffeePrice: number;
  socialLinks?: CreatorSocialLinks | undefined;
  goal?: CreatorGoal | undefined;
  thankYouMessage?: string | undefined;
  allowPublicMessages?: boolean | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCreatorProfileRequest {
  name?: string | undefined;
  bio?: string | undefined;
  avatarUrl?: string | undefined;
  coffeePrice?: number | undefined;
  socialLinks?: CreatorSocialLinks | undefined;
  goal?: CreatorGoal | undefined;
  thankYouMessage?: string | undefined;
  allowPublicMessages?: boolean | undefined;
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
  coffeePrice: number;
  socialLinks?: CreatorSocialLinks | undefined;
  goal?: CreatorGoal | undefined;
}
