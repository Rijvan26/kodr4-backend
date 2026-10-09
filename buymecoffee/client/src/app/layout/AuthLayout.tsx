import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-360 lg:grid-cols-[1.04fr_0.96fr]">
        <aside className="relative hidden overflow-hidden bg-primary px-12 py-10 text-primary-contrast lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="flex items-center gap-3">
            <span className="grid size-brand-mark place-items-center border border-primary-border text-sm font-semibold">S</span>
            <span className="text-brand tracking-eyebrow">STUDIO SUPPORT</span>
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="text-caption tracking-kicker text-accent">A SPACE FOR INDEPENDENT WORK</p>
            <h1 className="mt-6 font-serif text-display">
              Make good work.<br />
              Keep it moving.
            </h1>
            <p className="mt-6 max-w-sm text-intro text-primary-muted">
              Your creative practice, backed by the people who value it.
            </p>
          </div>

          <div className="flex items-center gap-3 text-body-small text-primary-muted">
            <span className="h-px w-8 bg-accent" />
            INDEPENDENT BY NATURE
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-24 size-110 rounded-full border border-primary-decoration" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-12 size-80 rounded-full border border-primary-decoration" />
        </aside>

        <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-110">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <span className="grid size-brand-mark-compact place-items-center bg-primary text-sm font-semibold text-primary-foreground">S</span>
              <span className="text-brand tracking-eyebrow">STUDIO SUPPORT</span>
            </div>
            <Outlet />
            <p className="mt-10 text-center text-body-small text-subtle-foreground">
              A thoughtful space for independent creators.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;