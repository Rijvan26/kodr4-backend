import { Outlet } from "react-router-dom";
import Logo from "../../shared/ui/Logo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[90rem] lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left editorial panel with rich emerald atmosphere & visual cards */}
        <aside className="relative hidden overflow-hidden bg-panel-dark px-12 py-10 text-panel-dark-text lg:flex lg:flex-col lg:justify-between xl:px-20">
          {/* Subtle background gradient glow & grid overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(16,185,129,0.15),transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-emerald-500/10 blur-3xl"
          />

          {/* Brand mark */}
          <div className="relative z-10 flex items-center">
            <Logo variant="dark" size="md" />
          </div>

          {/* Hero copy + Visual empty space element */}
          <div className="relative z-10 my-auto py-8">
            <div className="animate-fade-in-up max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-caption tracking-kicker text-panel-dark-accent font-semibold uppercase">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                The Independent Creator Platform
              </span>
              <h1 className="mt-5 font-display text-display leading-[1.08] text-white">
                Make your best work.
                <br />
                <span className="text-emerald-400">Get funded directly.</span>
              </h1>
              <p className="mt-4 max-w-md text-intro text-panel-dark-muted">
                supportme.com turns community appreciation into direct creative fuel. Simple, personal, and without middlemen.
              </p>
            </div>

            {/* Visual Floating Support Demonstration Card in Left Panel */}
            <div className="animate-float mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    ☕
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Recent Support Received</p>
                    <p className="text-xs text-panel-dark-muted">Just now via supportme.com</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                  + ₹300
                </span>
              </div>
              <p className="mt-3 text-xs italic text-emerald-100/90 leading-relaxed">
                &ldquo;Thanks for all the open-source libraries and tutorials you write every weekend! Keep building!&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-panel-dark-muted">
                <span>From <strong>Aditya K.</strong></span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.29a.75.75 0 00-1.06-1.06L7 7.59 5.65 6.24a.75.75 0 00-1.06 1.06l1.88 1.88a.75.75 0 001.06 0l3.88-3.89z" />
                  </svg>
                  Verified Razorpay Transfer
                </span>
              </div>
            </div>

            {/* Visual Metric Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-panel-dark-muted">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5">
                <span className="text-emerald-400 font-bold">12,000+</span> Creators Supported
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5">
                <span className="text-emerald-400 font-bold">100%</span> Direct Payouts
              </div>
            </div>
          </div>

          {/* Footer line */}
          <div className="relative z-10 flex items-center justify-between text-body-small text-panel-dark-muted">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-emerald-400/50" />
              <span>INDEPENDENT BY NATURE</span>
            </div>
            <span className="text-xs text-emerald-400/80">supportme.com</span>
          </div>

          {/* Decorative geometric contour lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-24 size-110 rounded-full border border-emerald-500/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-12 size-80 rounded-full border border-emerald-500/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-16 size-60 rounded-full border border-emerald-500/10"
          />
        </aside>

        {/* Right form panel */}
        <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-[26rem]">
            {/* Mobile brand header */}
            <div className="mb-8 flex items-center justify-center lg:hidden">
              <Logo size="md" />
            </div>

            <div className="animate-fade-in">
              <Outlet />
            </div>

            <p className="mt-10 text-center text-body-small text-muted">
              Protected by secure Razorpay payments &bull; <span className="font-medium text-foreground">supportme.com</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;