import { useAppDispatch } from "../../../app/store/hook";
import { setAccessToken } from "../state/auth.slice";
import { useLoginMutation, useRegisterMutation } from "../api/auth.api";
import type { LoginRequest, RegisterRequest } from "../types/auth.type";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [sendLoginRequest, loginState] = useLoginMutation();
  const [sendRegisterRequest, registerState] = useRegisterMutation();

  const login = async (credentials: LoginRequest) => {
    const response = await sendLoginRequest(credentials).unwrap();

    dispatch(setAccessToken(response.data.accessToken));

    return response;
  };

  const register = async (registrationDetails: RegisterRequest) => {
    const response = await sendRegisterRequest(registrationDetails).unwrap();

    dispatch(setAccessToken(response.data.accessToken));

    return response;
  };

  return {
    login,
    loginState,
    register,
    registerState,
  };
};