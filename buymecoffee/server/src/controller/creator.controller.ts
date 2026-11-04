import type { Request, Response } from "express";
import { appError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  findCreatorProfileById,
  updateCreatorProfileById,
  findPublicCreatorByUsername,
} from "../DAO/creator.dao.js";
import { getCreatorPaymentDashboard } from "../DAO/payment.dao.js";
import type {
  CreatorProfile,
  PublicCreator,
  UpdateCreatorProfileRequest,
} from "../types/creator.types.js";
import type { Iuser } from "../models/user.model.js";
import { getValidCoffeePrice } from "../config/constants.js";

const DEFAULT_AVATAR = "https://ik.imagekit.io/hnoglyswo0/user-avatar.webp";

function toCreatorProfile(user: Iuser): CreatorProfile {
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl ?? DEFAULT_AVATAR,
    coffeePrice: getValidCoffeePrice(user.coffeePrice),
    socialLinks: user.socialLinks,
    goal: user.goal,
    thankYouMessage: user.thankYouMessage,
    allowPublicMessages: user.allowPublicMessages,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function toPublicCreator(user: Iuser): PublicCreator {
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl ?? DEFAULT_AVATAR,
    coffeePrice: getValidCoffeePrice(user.coffeePrice),
    socialLinks: user.socialLinks,
    goal: user.goal,
  };
}

function getAuthenticatedUserId(request: Request): string {
  if (!request.user) {
    throw new appError("Authentication required", 401);
  }

  return request.user._id.toString();
}

export const getCreatorProfile = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = getAuthenticatedUserId(request);
    const user = await findCreatorProfileById(userId);

    if (!user) {
      throw new appError("Creator profile not found", 404);
    }

    sendSuccess(response, 200, "Creator profile fetched", {
      creator: toCreatorProfile(user),
    });
  },
);

export const updateCreatorProfile = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = getAuthenticatedUserId(request);
    const profileUpdates: UpdateCreatorProfileRequest = {};

    if (request.body.name !== undefined) {
      profileUpdates.name = request.body.name;
    }
    if (request.body.bio !== undefined) {
      profileUpdates.bio = request.body.bio;
    }
    if (request.body.avatarUrl !== undefined) {
      profileUpdates.avatarUrl = request.body.avatarUrl;
    }
    if (request.body.coffeePrice !== undefined) {
      profileUpdates.coffeePrice = request.body.coffeePrice;
    }
    if (request.body.socialLinks !== undefined) {
      profileUpdates.socialLinks = request.body.socialLinks;
    }
    if (request.body.goal !== undefined) {
      profileUpdates.goal = request.body.goal;
    }
    if (request.body.thankYouMessage !== undefined) {
      profileUpdates.thankYouMessage = request.body.thankYouMessage;
    }
    if (request.body.allowPublicMessages !== undefined) {
      profileUpdates.allowPublicMessages = request.body.allowPublicMessages;
    }

    const user = await updateCreatorProfileById(userId, profileUpdates);

    if (!user) {
      throw new appError("Creator profile not found", 404);
    }

    sendSuccess(response, 200, "Creator profile updated", {
      creator: toCreatorProfile(user),
    });
  },
);

export const getPublicCreator = asyncHandler(
  async (request: Request, response: Response) => {
    const username = request.params.username;
    if (typeof username !== "string" || !username.trim()) {
      throw new appError("Creator not found", 404);
    }

    const creator = await findPublicCreatorByUsername(username);

    if (!creator) {
      throw new appError("Creator not found", 404);
    }

    const dashboard = await getCreatorPaymentDashboard(
      creator._id.toString(),
    );

    sendSuccess(response, 200, "Creator fetched", {
      creator: toPublicCreator(creator),
      totalAmount: dashboard.totalAmount,
      totalSupporters: dashboard.totalSupporters,
      successfulPayments: dashboard.successfulPayments,
      recentPayments: dashboard.recentPayments,
    });
  },
);

export const getCreatorDashboard = asyncHandler(
  async (request: Request, response: Response) => {
    const creator = request.user;
    if (!creator) {
      throw new appError("Authentication required", 401);
    }

    const dashboard = await getCreatorPaymentDashboard(
      creator._id.toString(),
    );

    sendSuccess(response, 200, "Creator dashboard fetched", {
      creator: {
        name: creator.name,
        username: creator.username,
        avatarUrl: creator.avatarUrl ?? DEFAULT_AVATAR,
        coffeePrice: getValidCoffeePrice(creator.coffeePrice),
      },
      ...dashboard,
    });
  },
);
