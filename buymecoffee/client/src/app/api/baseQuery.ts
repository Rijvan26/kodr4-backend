import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store/store";
import type { RefreshResponse } from "../../features/auth/types/auth.type";
import {
  setAccessToken,
  clearAccessToken,
} from "../../features/auth/state/auth.slice";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "https://kodr4-backend.onrender.com/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const requestUrl = typeof args === "string" ? args : args.url;
  const isRefreshRequest =
    requestUrl.split("?")[0].replace(/^\//, "") === "auth/refresh";

  if (result.error?.status === 401 && !isRefreshRequest) {
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const refreshResponse = refreshResult.data as RefreshResponse;

      api.dispatch(setAccessToken(refreshResponse.data.accessToken));

      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAccessToken());
    }
  }

  return result;
};
