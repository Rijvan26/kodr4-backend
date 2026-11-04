export interface CreatorSocialLinks {
  instagram?: string;
  youtube?: string;
  twitter?: string;
  website?: string;
}

export interface CreatorGoal {
  title?: string;
  targetAmount?: number;
  showGoal?: boolean;
}

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  coffeePrice: number;
  socialLinks?: CreatorSocialLinks;
  goal?: CreatorGoal;
  thankYouMessage?: string;
  allowPublicMessages?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorProfileResponse {
  success: true;
  message: string;
  data: {
    creator: CreatorProfile;
  };
}

export interface UpdateCreatorProfileRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  coffeePrice?: number;
  socialLinks?: CreatorSocialLinks;
  goal?: CreatorGoal;
  thankYouMessage?: string;
  allowPublicMessages?: boolean;
}

export interface PublicCreator {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  coffeePrice: number;
  socialLinks?: CreatorSocialLinks;
  goal?: CreatorGoal;
}

export interface PublicSupporter {
  supporterName: string;
  amount: number;
  currency: string;
  coffeeQuantity?: number;
  message?: string;
  isPrivate?: boolean;
  date: string;
  status: "paid";
}

export interface PublicCreatorResponse {
  success: true;
  message: string;
  data: {
    creator: PublicCreator;
    totalAmount?: number;
    totalSupporters?: number;
    successfulPayments?: number;
    recentPayments?: PublicSupporter[];
  };
}

export interface CreatorDashboardPayment {
  supporterName: string;
  amount: number;
  currency: string;
  coffeeQuantity?: number;
  message?: string;
  isPrivate?: boolean;
  date: string;
  status: "paid";
}

export interface CreatorDashboardResponse {
  success: true;
  message: string;
  data: {
    creator: {
      name: string;
      username: string;
      avatarUrl?: string;
      coffeePrice?: number;
    };
    totalAmount: number;
    totalSupporters: number;
    successfulPayments: number;
    totalSuccessfulPayments?: number;
    totalCups?: number;
    recentPayments: CreatorDashboardPayment[];
  };
}
