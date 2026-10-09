import { baseApi } from "../../../app/api/baseApi";
import type {
  CreatorDashboardResponse,
  CreatorProfileResponse,
  PublicCreatorResponse,
  UpdateCreatorProfileRequest,
} from "../types/creator.types";

export const creatorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorDashboard: builder.query<CreatorDashboardResponse, void>({
      query: () => ({
        url: "creator/dashboard",
        method: "GET",
      }),
    }),
    getCreatorProfile: builder.query<CreatorProfileResponse, void>({
      query: () => ({
        url: "creator/profile",
        method: "GET",
      }),
    }),
    getPublicCreator: builder.query<PublicCreatorResponse, string>({
      query: (username) => ({
        url: `creators/${encodeURIComponent(username)}`,
        method: "GET",
      }),
    }),
    updateCreatorProfile: builder.mutation<
      CreatorProfileResponse,
      UpdateCreatorProfileRequest
    >({
      query: (profileUpdates) => ({
        url: "creator/profile",
        method: "PATCH",
        body: profileUpdates,
      }),
    }),
  }),
});

export const {
  useGetCreatorDashboardQuery,
  useGetCreatorProfileQuery,
  useGetPublicCreatorQuery,
  useUpdateCreatorProfileMutation,
} = creatorApi;