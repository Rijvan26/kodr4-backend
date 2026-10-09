import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { baseApi } from "../api/baseApi";
import { useLogoutMutation } from "../../features/auth/api/auth.api";
import { clearAccessToken } from "../../features/auth/state/auth.slice";
import { useAppDispatch } from "../store/hook";
import Button from "../../shared/ui/Button";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [logoutError, setLogoutError] = useState(false);

  const handleLogout = async () => {
    setLogoutError(false);

    try {
      await logout().unwrap();
      dispatch(clearAccessToken());
      dispatch(baseApi.util.resetApiState());
      navigate("/login", { replace: true });
    } catch {
      setLogoutError(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-page-gutter py-3 sm:px-page-gutter-wide">
          <NavLink
            to="/dashboard"
            end
            className="font-serif text-section-heading text-primary"
          >
            Studio Support
          </NavLink>
          <div className="flex flex-wrap items-center gap-2">
            <nav aria-label="Main navigation" className="flex items-center gap-1">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `rounded-control px-3 py-2 text-body-small transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${isActive ? "bg-primary-muted text-primary" : "text-muted hover:bg-background hover:text-foreground"}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/creator"
                className={({ isActive }) =>
                  `rounded-control px-3 py-2 text-body-small transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${isActive ? "bg-primary-muted text-primary" : "text-muted hover:bg-background hover:text-foreground"}`
                }
              >
                Profile
              </NavLink>
            </nav>
            <Button
              type="button"
              density="compact"
              variant="secondary"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        </div>
        {logoutError && (
          <p className="mx-auto max-w-6xl px-page-gutter pb-3 text-body-small text-danger-foreground sm:px-page-gutter-wide" role="alert">
            Could not log out. Please try again.
          </p>
        )}
      </header>
      <Outlet />
    </div>
  );
};

export default MainLayout;