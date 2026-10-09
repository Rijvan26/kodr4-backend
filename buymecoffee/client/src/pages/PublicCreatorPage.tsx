import { useParams } from "react-router-dom";
import { useGetPublicCreatorQuery } from "../features/creator/api/creator.api";
import SupportForm from "../features/support/components/SupportForm";
import Button from "../shared/ui/Button";
import Card from "../shared/ui/Card";

const PublicCreatorPage = () => {
  const { username: routeUsername = "" } = useParams<{ username: string }>();
  const username = routeUsername.startsWith("@")
    ? routeUsername.slice(1)
    : routeUsername;
  const {
    data: creatorResponse,
    error: creatorError,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetPublicCreatorQuery(username, {
    skip: !routeUsername.startsWith("@") || !username,
  });
  const creator = creatorResponse?.data.creator;
  const isNotFound =
    isError &&
    typeof creatorError === "object" &&
    creatorError !== null &&
    "status" in creatorError &&
    creatorError.status === 404;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide">
        <p className="mx-auto max-w-3xl text-body text-muted" role="status">
          Loading creator...
        </p>
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide">
        <section
          className="mx-auto max-w-3xl"
          aria-labelledby="creator-not-found-heading"
        >
          <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
            PUBLIC CREATOR PAGE
          </p>
          <h1
            id="creator-not-found-heading"
            className="mt-3 font-serif text-page-title-mobile text-foreground sm:text-heading"
          >
            {isNotFound ? "Creator not found" : "Creator page unavailable"}
          </h1>
          <p className="mt-3 text-body-relaxed text-muted" role="alert">
            {isNotFound
              ? "This creator doesn't exist or the username is incorrect."
              : "We couldn't load this creator right now. Please try again."}
          </p>
          {!isNotFound && username && (
            <Button
              type="button"
              density="compact"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="mt-5"
            >
              {isFetching ? "Loading..." : "Try again"}
            </Button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide sm:py-page-block-wide">
      <div className="mx-auto grid max-w-5xl items-start gap-section lg:grid-cols-2">
        <Card
          className="p-panel sm:p-panel-wide"
          aria-labelledby="public-creator-name"
        >
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <img
              src={creator.avatarUrl}
              alt={`${creator.name}'s avatar`}
              className="size-avatar rounded-avatar border border-border bg-background object-cover"
            />
            <div>
              <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
                CREATOR PROFILE
              </p>
              <h1
                id="public-creator-name"
                className="mt-2 font-serif text-page-title-mobile text-foreground sm:text-heading"
              >
                {creator.name}
              </h1>
              <p className="mt-1 text-label text-primary-muted-foreground">
                @{creator.username}
              </p>
            </div>
          </div>

          {creator.bio && (
            <p className="mt-7 max-w-2xl whitespace-pre-wrap text-body-reading text-secondary-foreground">
              {creator.bio}
            </p>
          )}

          <div className="mt-7 rounded-card border border-border-subtle bg-surface-muted p-5">
            <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
              SUPPORT MY WORK
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl" aria-hidden="true">☕</span>
              <span className="font-serif text-heading text-foreground">₹{creator.coffeePrice}</span>
            </div>
            <p className="mt-1 text-body-small text-muted">
              Buy me a coffee
            </p>
          </div>
        </Card>
        <SupportForm
          creatorName={creator.name}
          creatorUsername={creator.username}
          coffeePrice={creator.coffeePrice}
        />
      </div>
    </main>
  );
};

export default PublicCreatorPage;