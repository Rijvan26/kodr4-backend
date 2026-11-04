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
      providesTags: ["CreatorDashboard"],
    }),
    getCreatorProfile: builder.query<CreatorProfileResponse, void>({
      query: () => ({
        url: "creator/profile",
        method: "GET",
      }),
      providesTags: ["CreatorProfile"],
    }),
    getPublicCreator: builder.query<PublicCreatorResponse, string>({
      query: (username) => ({
        url: `creators/${encodeURIComponent(username)}`,
        method: "GET",
      }),
      providesTags: (_res, _err, username) => [{ type: "PublicCreator", id: username }],
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
      invalidatesTags: ["CreatorProfile", "CreatorDashboard", "PublicCreator"],
    }),
  }),
});

export const {
  useGetCreatorDashboardQuery,
  useGetCreatorProfileQuery,
  useGetPublicCreatorQuery,
  useUpdateCreatorProfileMutation,
} = creatorApi;
