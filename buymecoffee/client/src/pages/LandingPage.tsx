import { Link } from "react-router-dom";
import Logo from "../shared/ui/Logo";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-page-gutter py-3.5 sm:px-page-gutter-wide">
          <Link to="/" className="flex items-center transition-opacity hover:opacity-85" aria-label="supportme.com Home">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-control px-4 py-2 text-button text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus font-medium"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-control bg-primary px-5 py-2.5 text-button text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle decorative emerald gradient aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-1/4 size-[32rem] rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -left-32 size-[24rem] rounded-full bg-emerald-400/8 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-page-gutter py-16 sm:px-page-gutter-wide sm:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            {/* Left: Copy & Visual Category Chips */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-primary">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                The Friendly Creator Support Platform
              </div>

              <h1 className="mt-5 font-display text-display text-foreground leading-[1.08]">
                Your work deserves
                <br />
                <span className="text-primary underline decoration-emerald-500/30 decoration-wavy">
                  real, direct support.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-body-reading text-secondary-foreground leading-relaxed">
                Turn genuine community love into creative fuel. Give your audience a seamless, 
                heartfelt way to buy you a coffee — powered by <strong className="text-foreground">supportme.com</strong> with zero subscriptions and instant payouts.
              </p>

              {/* Creator category pills in previously empty space */}
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="font-semibold text-foreground">Loved by:</span>
                {["Writers", "Open Source Devs", "Podcasters", "Artists", "Educators"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground shadow-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-control bg-primary px-8 py-3.5 text-button text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md active:bg-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Create your support page
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-control px-4 py-3.5 text-button text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus font-medium"
                >
                  See how it works
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v10M4 9l4 4 4-4" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: Rich Visual Creator Page Preview Card */}
            <div className="animate-fade-in-up delay-2 relative">
              {/* Floating Supporter Badge (Top right) */}
              <div className="animate-float absolute -top-5 -right-4 z-20 rounded-full border border-emerald-500/20 bg-surface px-4 py-2 shadow-elevated text-xs font-semibold text-foreground flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>+ ₹300 from Rohit</span>
                <span className="text-emerald-600">☕☕☕</span>
              </div>

              {/* Creator page preview card */}
              <div className="rounded-card-lg border border-border bg-surface p-6 shadow-elevated sm:p-8">
                {/* Creator preview */}
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800 border-2 border-emerald-200">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-heading-small text-foreground">Arjun Mehta</p>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        Verified
                      </span>
                    </div>
                    <p className="text-body-small text-muted font-mono">supportme.com/@arjun</p>
                  </div>
                </div>
                <p className="mt-4 text-body-small text-secondary-foreground leading-relaxed">
                  I build free open-source developer tools and write weekly essays on systems engineering. Your backing helps keep all my tools 100% ad-free!
                </p>

                {/* Support interaction preview */}
                <div className="mt-5 rounded-card border border-border-subtle bg-surface-alt p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body-small font-medium text-surface-foreground">☕ Buy Arjun a coffee</span>
                    <span className="text-body-small text-muted font-medium">₹100 each</span>
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`flex h-9 items-center justify-center rounded-control text-body-small font-semibold transition-colors ${
                          n === 3
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "border border-border bg-surface text-surface-foreground"
                        }`}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-card bg-emerald-100/70 border border-emerald-200/50 px-3.5 py-2.5">
                    <span className="text-body-small font-semibold text-emerald-900">Total Contribution</span>
                    <span className="font-display text-lg font-bold text-emerald-950">₹300</span>
                  </div>
                </div>
              </div>

              {/* Floating verified receipt (Bottom left) */}
              <div className="absolute -bottom-5 -left-4 rounded-xl border border-emerald-200 bg-emerald-50/95 backdrop-blur-sm px-4 py-3 shadow-card sm:-bottom-6 sm:-left-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.29a.75.75 0 00-1.06-1.06L7 7.59 5.65 6.24a.75.75 0 00-1.06 1.06l1.88 1.88a.75.75 0 001.06 0l3.88-3.89z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-emerald-900">Razorpay Verified</p>
                    <p className="text-meta text-emerald-700">Instant direct transfer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-page-gutter py-20 sm:px-page-gutter-wide sm:py-28">
          <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
            <p className="text-caption tracking-kicker text-primary font-semibold">
              HOW SUPPORTME.COM WORKS
            </p>
            <h2 className="mt-3 font-display text-heading-xl text-foreground">
              Three simple steps to start receiving support
            </h2>
            <p className="mt-3 text-body-relaxed text-muted">
              Get set up in seconds. Share your link anywhere. Let your supporters back what you do.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {/* Step 1 */}
            <div className="animate-fade-in-up delay-1 rounded-card-lg border border-border bg-surface-alt/50 p-6 text-center sm:text-left">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-xs sm:mx-0">
                1
              </div>
              <h3 className="font-display text-heading-small text-foreground">
                Claim your link
              </h3>
              <p className="mt-2 text-body-relaxed text-muted">
                Choose your username to get your custom <code className="text-primary font-mono text-xs">supportme.com/@you</code> page and set your default coffee price.
              </p>
            </div>

            {/* Step 2 */}
            <div className="animate-fade-in-up delay-2 rounded-card-lg border border-border bg-surface-alt/50 p-6 text-center sm:text-left">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-xs sm:mx-0">
                2
              </div>
              <h3 className="font-display text-heading-small text-foreground">
                Share with fans
              </h3>
              <p className="mt-2 text-body-relaxed text-muted">
                Drop your link into your social bios, YouTube descriptions, newsletters, GitHub READMEs, or personal blog.
              </p>
            </div>

            {/* Step 3 */}
            <div className="animate-fade-in-up delay-3 rounded-card-lg border border-border bg-surface-alt/50 p-6 text-center sm:text-left">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-xs sm:mx-0">
                3
              </div>
              <h3 className="font-display text-heading-small text-foreground">
                Receive &amp; thrive
              </h3>
              <p className="mt-2 text-body-relaxed text-muted">
                Supporters send coffees via Razorpay (UPI, Cards, NetBanking). Track every supporter in your real-time creator dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="border-t border-border bg-surface-alt">
        <div className="mx-auto max-w-6xl px-page-gutter py-20 sm:px-page-gutter-wide sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-in-up">
              <p className="text-caption tracking-kicker text-primary font-semibold">
                TRUST &amp; TRANSPARENCY
              </p>
              <h2 className="mt-3 font-display text-heading-xl text-foreground">
                Built for creators who value independence
              </h2>
              <p className="mt-4 text-body-reading text-secondary-foreground leading-relaxed">
                supportme.com runs on trusted payment infrastructure with end-to-end encryption. 
                We believe creators shouldn&apos;t have to battle ad networks or subscription fatigue to get fairly supported.
              </p>
            </div>

            <div className="animate-fade-in-up delay-1 space-y-4">
              {[
                {
                  icon: "🔒",
                  title: "Razorpay-Secured Payments",
                  description: "PCI-DSS compliant bank-grade encryption. UPI, Cards & NetBanking supported smoothly.",
                },
                {
                  icon: "⚡",
                  title: "Real-Time Creator Dashboard",
                  description: "Every contribution and supporter note pops up instantly on your live dashboard.",
                },
                {
                  icon: "🤝",
                  title: "Direct & Personal Connection",
                  description: "No invasive algorithms. Just a clean, genuine exchange between you and your community.",
                },
              ].map((point) => (
                <div
                  key={point.title}
                  className="flex items-start gap-4 rounded-card-lg border border-border bg-surface p-5 shadow-xs"
                >
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {point.icon}
                  </span>
                  <div>
                    <h3 className="text-label font-semibold text-foreground">{point.title}</h3>
                    <p className="mt-1 text-body-small text-muted">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-page-gutter py-20 text-center sm:px-page-gutter-wide sm:py-28">
          <div className="animate-fade-in-up">
            <h2 className="mx-auto max-w-xl font-display text-heading-xl text-foreground">
              Ready to give your audience a way to support you?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-body-relaxed text-muted">
              Join thousands of creators who fund their passions independently with supportme.com.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-control bg-primary px-8 py-3.5 text-button text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Create your supportme.com page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-alt">
        <div className="mx-auto max-w-6xl px-page-gutter py-10 sm:px-page-gutter-wide">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <Logo size="sm" />
            <p className="text-body-small text-muted">
              supportme.com &bull; The thoughtful home for independent creator support.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
