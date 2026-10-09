import { baseApi } from "../../../app/api/baseApi";
import type {
  AuthResponse,
  LoginRequest,
  LogoutResponse,
  MeResponse,
  RefreshResponse,
  RegisterRequest,
} from "../types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    me: builder.query<MeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;