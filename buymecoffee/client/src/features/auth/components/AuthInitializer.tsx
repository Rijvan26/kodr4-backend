import { useEffect, useRef, type ReactNode } from "react";
import { useRefreshMutation } from "../api/auth.api";
import {
  clearAccessToken,
  setAccessToken,
  setAuthInitialized,
} from "../state/auth.slice";
import { useAppDispatch, useAppSelector } from "../../../app/store/hook";

interface AuthInitializerProps {
  children: ReactNode;
}

const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const [refresh] = useRefreshMutation();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const initializeAuth = async () => {
      try {
        const response = await refresh().unwrap();
        dispatch(setAccessToken(response.data.accessToken));
      } catch {
        dispatch(clearAccessToken());
      } finally {
        dispatch(setAuthInitialized());
      }
    };

    void initializeAuth();
  }, [dispatch, refresh]);

  if (!isInitialized) {
    return (
      <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground">
        <p className="mx-auto max-w-3xl text-body text-muted" role="status">
          Restoring your session...
        </p>
      </main>
    );
  }

  return children;
};

export default AuthInitializer;