import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { baseApi } from "../api/baseApi";
import { useLogoutMutation } from "../../features/auth/api/auth.api";
import { clearAccessToken } from "../../features/auth/state/auth.slice";
import { useAppDispatch } from "../store/hook";
import Button from "../../shared/ui/Button";
import Logo from "../../shared/ui/Logo";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [logoutError, setLogoutError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-control px-3.5 py-2 text-body-small font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
      isActive
        ? "text-primary font-semibold bg-primary-muted/50 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary"
        : "text-muted hover:text-foreground hover:bg-surface-alt/60"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-page-gutter py-3 sm:px-page-gutter-wide">
          {/* Brand Logo */}
          <NavLink
            to="/dashboard"
            end
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
            aria-label="supportme.com dashboard"
          >
            <Logo size="sm" />
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <nav aria-label="Main navigation" className="flex items-center gap-1">
              <NavLink to="/dashboard" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/dashboard/creator" className={navLinkClass}>
                Profile Settings
              </NavLink>
            </nav>
            <div className="ml-3 h-5 w-px bg-border" />
            <Button
              type="button"
              density="compact"
              variant="ghost"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="ml-2 text-muted hover:text-danger-foreground hover:bg-danger-surface"
            >
              {isLoggingOut ? "Logging out…" : "Log out"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-control text-muted transition-colors hover:text-foreground hover:bg-surface-alt sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="17" y2="5" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="15" x2="17" y2="15" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="animate-fade-in-down border-t border-border-subtle bg-surface px-page-gutter py-3 sm:hidden">
            <nav aria-label="Main navigation" className="flex flex-col gap-1">
              <NavLink
                to="/dashboard"
                end
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/creator"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile Settings
              </NavLink>
            </nav>
            <div className="my-2 h-px bg-border-subtle" />
            <Button
              type="button"
              density="compact"
              variant="ghost"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="w-full justify-start text-muted hover:text-danger-foreground"
            >
              {isLoggingOut ? "Logging out…" : "Log out"}
            </Button>
          </div>
        )}

        {/* Logout error banner */}
        {logoutError && (
          <div className="border-t border-danger-border bg-danger-surface">
            <p
              className="mx-auto max-w-6xl px-page-gutter py-2.5 text-body-small text-danger-foreground sm:px-page-gutter-wide"
              role="alert"
            >
              Could not log out. Please try again.
            </p>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  );
};

export default MainLayout;