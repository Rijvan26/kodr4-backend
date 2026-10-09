import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCreatorDashboardQuery } from "../features/creator/api/creator.api";
import Button from "../shared/ui/Button";
import Card from "../shared/ui/Card";

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
};

const formatPaymentDate = (date: string) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

const DashboardPage = () => {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const {
    data: dashboardResponse,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetCreatorDashboardQuery(undefined, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
  });
  const dashboard = dashboardResponse?.data;
  const creator = dashboard?.creator;
  const recentPayments = dashboard?.recentPayments ?? [];
  const currency = recentPayments[0]?.currency ?? "INR";
  const publicPageUrl = creator
    ? new URL(`/@${encodeURIComponent(creator.username)}`, window.location.origin).toString()
    : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicPageUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide">
        <p className="mx-auto max-w-6xl text-body text-muted" role="status">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  if (isError || !dashboard || !creator) {
    return (
      <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide">
        <section className="mx-auto max-w-6xl" aria-labelledby="dashboard-heading">
          <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
            CREATOR STUDIO
          </p>
          <h1
            id="dashboard-heading"
            className="mt-3 font-serif text-page-title-mobile sm:text-heading"
          >
            Your dashboard
          </h1>
          <p className="mt-5 rounded-card border border-danger-border bg-danger-surface px-control-x py-control-y text-body text-danger-foreground" role="alert">
            We couldn&apos;t load your creator activity. Please try again.
          </p>
          <Button
            type="button"
            density="compact"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="mt-5"
          >
            {isFetching ? "Loading..." : "Try again"}
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide sm:py-page-block-wide">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
              CREATOR STUDIO
            </p>
            <h1 className="mt-3 font-serif text-page-title-mobile sm:text-heading">
              Welcome back, {creator.name}
            </h1>
            <p className="mt-2 text-body-relaxed text-muted">
              Here&apos;s how your community has been showing up for you.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Link
              to={`/${encodeURIComponent(creator.username)}`}
              className="inline-flex h-control-compact items-center justify-center rounded-control border border-border bg-surface px-button-x text-button text-surface-foreground transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              View your page
            </Link>
            <Button
              type="button"
              density="compact"
              variant="secondary"
              onClick={() => void handleCopyLink()}
            >
              {copyStatus === "copied" ? "Copied" : "Copy link"}
            </Button>
            {copyStatus !== "idle" && (
              <span className="basis-full text-right text-body-small text-muted" role="status">
                {copyStatus === "copied"
                  ? "Creator link copied."
                  : "Could not copy link. Check clipboard permissions."}
              </span>
            )}
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Creator totals">
          <Card className="p-panel sm:p-panel-wide">
            <p className="text-meta text-muted">Total received</p>
            <p className="mt-3 break-words font-serif text-heading text-foreground">
              {formatCurrency(dashboard.totalAmount, currency)}
            </p>
          </Card>
          <Card className="p-panel sm:p-panel-wide">
            <p className="text-meta text-muted">Supporters</p>
            <p className="mt-3 font-serif text-heading text-foreground">
              {dashboard.totalSupporters.toLocaleString()}
            </p>
          </Card>
          <Card className="p-panel sm:p-panel-wide">
            <p className="text-meta text-muted">Successful payments</p>
            <p className="mt-3 font-serif text-heading text-foreground">
              {dashboard.successfulPayments.toLocaleString()}
            </p>
          </Card>
        </section>

        <section className="mt-10" aria-labelledby="recent-support-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
                FROM YOUR COMMUNITY
              </p>
              <h2
                id="recent-support-heading"
                className="mt-2 text-section-heading text-foreground"
              >
                Recent support
              </h2>
            </div>
            <span className="text-body-small text-muted">
              {recentPayments.length} {recentPayments.length === 1 ? "payment" : "payments"}
            </span>
          </div>

          {recentPayments.length === 0 ? (
            <Card className="px-panel py-10 text-center sm:px-panel-wide">
              <h3 className="font-serif text-section-heading text-foreground">
                Your first cup is waiting
              </h3>
              <p className="mx-auto mt-2 max-w-md text-body-relaxed text-muted">
                Share your creator page with your community and their support will show up here.
              </p>
              <Link
                to={`/${encodeURIComponent(creator.username)}`}
                className="mt-5 inline-flex text-button text-primary underline decoration-link-decoration underline-offset-4 hover:text-primary-hover"
              >
                Open your creator page
              </Link>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-card border border-border bg-surface">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-subtle bg-background/70 text-meta text-muted">
                    <th scope="col" className="px-5 py-3 font-medium">Supporter</th>
                    <th scope="col" className="px-5 py-3 font-medium">Date</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment, index) => (
                    <tr
                      key={`${payment.date}-${payment.supporterName}-${index}`}
                      className="border-b border-border-subtle last:border-0"
                    >
                      <th scope="row" className="px-5 py-4 font-medium text-surface-foreground">
                        {payment.supporterName || "Anonymous supporter"}
                      </th>
                      <td className="whitespace-nowrap px-5 py-4 text-body-small text-muted">
                        {formatPaymentDate(payment.date)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-small bg-success-surface px-2 py-1 text-caption capitalize text-success">
                          {payment.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-foreground">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;