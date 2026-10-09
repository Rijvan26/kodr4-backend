export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  coffeePrice: number;
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
}

export interface PublicCreator {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  coffeePrice: number;
}

export interface PublicCreatorResponse {
  success: true;
  message: string;
  data: {
    creator: PublicCreator;
  };
}

export interface CreatorDashboardPayment {
  supporterName: string;
  amount: number;
  currency: string;
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
    };
    totalAmount: number;
    totalSupporters: number;
    successfulPayments: number;
    recentPayments: CreatorDashboardPayment[];
  };
}