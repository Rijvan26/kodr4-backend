import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    clearAccessToken: (state) => {
      state.accessToken = null;
    },

    setAuthInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const {
  setAccessToken,
  clearAccessToken,
  setAuthInitialized,
} = authSlice.actions;

export default authSlice.reducer;