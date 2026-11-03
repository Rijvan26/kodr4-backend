import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useGetCreatorProfileQuery,
  useUpdateCreatorProfileMutation,
} from "../features/creator/api/creator.api";
import { getAuthFormErrorDetails } from "../features/auth/utils/authFormErrors";
import Button from "../shared/ui/Button";
import Input from "../shared/ui/Input";
import Textarea from "../shared/ui/Textarea";

interface CreatorProfileFormValues {
  name: string;
  bio: string;
  avatarUrl: string;
  coffeePrice: number;
}

const MIN_COFFEE_PRICE = 20;
const MAX_COFFEE_PRICE = 500;

const CreatorProfilePage = () => {
  const {
    data: profileResponse,
    error: profileError,
    isError: hasProfileError,
    isFetching: isFetchingProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetCreatorProfileQuery();
  const [updateCreatorProfile, updateProfileState] =
    useUpdateCreatorProfileMutation();
  const [requestError, setRequestError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const creator = profileResponse?.data.creator;
  const isSaving = updateProfileState.isLoading;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<CreatorProfileFormValues>({
    defaultValues: {
      name: "",
      bio: "",
      avatarUrl: "",
      coffeePrice: 100,
    },
  });

  useEffect(() => {
    if (!creator) {
      return;
    }

    reset({
      name: creator.name,
      bio: creator.bio ?? "",
      avatarUrl: creator.avatarUrl ?? "",
      coffeePrice: creator.coffeePrice ?? 100,
    });
  }, [creator, reset]);

  const handleProfileUpdate: SubmitHandler<CreatorProfileFormValues> = async (
    values,
  ) => {
    setRequestError(null);
    setSuccessMessage(null);

    try {
      const response = await updateCreatorProfile({
        name: values.name.trim(),
        bio: values.bio.trim(),
        avatarUrl: values.avatarUrl.trim(),
        coffeePrice: Number(values.coffeePrice),
      }).unwrap();

      const updatedCreator = response.data.creator;
      reset({
        name: updatedCreator.name,
        bio: updatedCreator.bio ?? "",
        avatarUrl: updatedCreator.avatarUrl ?? "",
        coffeePrice: updatedCreator.coffeePrice ?? 100,
      });
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      const details = getAuthFormErrorDetails(error);
      setRequestError(details.message);

      if (details.fieldErrors.name) {
        setError("name", {
          type: "server",
          message: details.fieldErrors.name,
        });
      }
      if (details.fieldErrors.bio) {
        setError("bio", {
          type: "server",
          message: details.fieldErrors.bio,
        });
      }
      if (details.fieldErrors.avatarUrl) {
        setError("avatarUrl", {
          type: "server",
          message: details.fieldErrors.avatarUrl,
        });
      }
      if (details.fieldErrors.coffeePrice) {
        setError("coffeePrice", {
          type: "server",
          message: details.fieldErrors.coffeePrice,
        });
      }
    }
  };

  const profileErrorMessage = hasProfileError
    ? getAuthFormErrorDetails(profileError).message
    : "Creator profile is unavailable.";

  if (isLoadingProfile) {
    return (
      <main className="min-h-[calc(100vh-4rem)] px-page-gutter py-page-block sm:px-page-gutter-wide">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3" role="status">
            <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <p className="text-body text-muted">Loading profile…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="min-h-[calc(100vh-4rem)] px-page-gutter py-page-block sm:px-page-gutter-wide">
        <section className="mx-auto max-w-3xl animate-fade-in" aria-labelledby="profile-heading">
          <p className="text-caption tracking-kicker text-primary font-semibold">
            CREATOR ACCOUNT
          </p>
          <h1
            id="profile-heading"
            className="mt-3 font-display text-heading text-foreground"
          >
            Creator profile
          </h1>
          <div className="mt-6 rounded-card border border-danger-border bg-danger-surface px-5 py-4" role="alert">
            <p className="font-medium text-danger-foreground">
              {profileErrorMessage}
            </p>
          </div>
          <Button
            type="button"
            density="compact"
            onClick={() => void refetchProfile()}
            disabled={isFetchingProfile}
            className="mt-5"
          >
            {isFetchingProfile ? "Loading…" : "Try again"}
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] px-page-gutter py-page-block sm:px-page-gutter-wide sm:py-page-block-wide">
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <header className="animate-fade-in-up mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-caption tracking-kicker text-primary font-semibold">
              SUPPORTME.COM SETTINGS
            </p>
            <h1 className="mt-2 font-display text-heading text-foreground">
              Creator profile
            </h1>
            <p className="mt-1 text-body-relaxed text-muted">
              Customize the profile and coffee price shown on your public page.
            </p>
          </div>
          <Link
            to={`/@${encodeURIComponent(creator.username)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover underline decoration-primary/30"
          >
            <span>View public page</span>
            <span>&rarr;</span>
          </Link>
        </header>

        {/* Account info — read only */}
        <section
          className="animate-fade-in-up delay-1 rounded-card-lg border border-border bg-surface p-6 sm:p-8 shadow-xs"
          aria-labelledby="account-info-heading"
        >
          <h2 id="account-info-heading" className="text-section-heading text-foreground">
            Account information
          </h2>
          <p className="mt-1 text-body-small text-muted">
            Your unique URL and account credentials.
          </p>

          <dl className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <dt className="text-meta text-muted font-medium uppercase tracking-wider">Your supportme.com URL</dt>
              <dd className="mt-1.5 text-label text-emerald-800 font-semibold font-mono text-xs">
                supportme.com/@{creator.username}
              </dd>
            </div>
            <div>
              <dt className="text-meta text-muted font-medium uppercase tracking-wider">Email</dt>
              <dd className="mt-1.5 break-all text-label text-surface-foreground">
                {creator.email}
              </dd>
            </div>
            <div>
              <dt className="text-meta text-muted font-medium uppercase tracking-wider">Default coffee price</dt>
              <dd className="mt-1.5 text-label text-surface-foreground font-medium">
                ☕ ₹{creator.coffeePrice}
              </dd>
            </div>
          </dl>
        </section>

        {/* Editable profile form */}
        <section
          className="animate-fade-in-up delay-2 mt-6 rounded-card-lg border border-border bg-surface p-6 sm:p-8"
          aria-labelledby="profile-details-heading"
        >
          <h2
            id="profile-details-heading"
            className="text-section-heading text-foreground"
          >
            Edit profile
          </h2>
          <p className="mt-1 text-body-small text-muted">
            Update the information shown to your supporters.
          </p>

          <form
            className="mt-6 space-y-form-gap"
            noValidate
            onSubmit={handleSubmit(handleProfileUpdate)}
          >
            {/* Name */}
            <div>
              <label
                htmlFor="creator-name"
                className="mb-field-label block text-label text-surface-foreground"
              >
                Name
              </label>
              <Input
                id="creator-name"
                type="text"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "creator-name-error" : undefined}
                {...register("name", {
                  required: "Enter your name.",
                  validate: (value) => {
                    const length = value.trim().length;
                    return (
                      (length >= 2 && length <= 50) ||
                      "Name must be 2-50 characters."
                    );
                  },
                  onChange: () => {
                    setRequestError(null);
                    setSuccessMessage(null);
                  },
                })}
              />
              {errors.name && (
                <p
                  id="creator-name-error"
                  className="mt-1.5 text-body-small text-danger"
                  role="alert"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="creator-bio"
                className="mb-field-label block text-label text-surface-foreground"
              >
                Bio
              </label>
              <Textarea
                id="creator-bio"
                rows={4}
                aria-invalid={Boolean(errors.bio)}
                aria-describedby={errors.bio ? "creator-bio-error" : undefined}
                placeholder="A short introduction"
                {...register("bio", {
                  maxLength: {
                    value: 160,
                    message: "Bio must be 160 characters or fewer.",
                  },
                  onChange: () => {
                    setRequestError(null);
                    setSuccessMessage(null);
                  },
                })}
              />
              {errors.bio && (
                <p
                  id="creator-bio-error"
                  className="mt-1.5 text-body-small text-danger"
                  role="alert"
                >
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label
                htmlFor="creator-avatar-url"
                className="mb-field-label block text-label text-surface-foreground"
              >
                Avatar URL
              </label>
              <Input
                id="creator-avatar-url"
                type="url"
                autoComplete="url"
                aria-invalid={Boolean(errors.avatarUrl)}
                aria-describedby={
                  errors.avatarUrl ? "creator-avatar-url-error" : undefined
                }
                placeholder="https://example.com/avatar.jpg"
                {...register("avatarUrl", {
                  required: "Enter an avatar URL.",
                  validate: (value) => {
                    try {
                      const url = new URL(value.trim());
                      return (
                        url.protocol === "http:" || url.protocol === "https:"
                      ) || "Enter a valid HTTP or HTTPS URL.";
                    } catch {
                      return "Enter a valid HTTP or HTTPS URL.";
                    }
                  },
                  onChange: () => {
                    setRequestError(null);
                    setSuccessMessage(null);
                  },
                })}
              />
              {errors.avatarUrl && (
                <p
                  id="creator-avatar-url-error"
                  className="mt-1.5 text-body-small text-danger"
                  role="alert"
                >
                  {errors.avatarUrl.message}
                </p>
              )}
            </div>

            {/* Coffee Price */}
            <div>
              <label
                htmlFor="creator-coffee-price"
                className="mb-field-label block text-label text-surface-foreground"
              >
                Coffee price (₹)
              </label>
              <Input
                id="creator-coffee-price"
                type="number"
                inputMode="numeric"
                min={MIN_COFFEE_PRICE}
                max={MAX_COFFEE_PRICE}
                step={1}
                aria-invalid={Boolean(errors.coffeePrice)}
                aria-describedby={
                  errors.coffeePrice
                    ? "creator-coffee-price-error"
                    : "creator-coffee-price-help"
                }
                placeholder="100"
                {...register("coffeePrice", {
                  required: "Enter a coffee price.",
                  valueAsNumber: true,
                  validate: (value) => {
                    if (value === undefined || value === null || Number.isNaN(value)) {
                      return "Enter a coffee price.";
                    }
                    if (!Number.isInteger(value)) {
                      return "Enter a whole number of rupees.";
                    }
                    if (value < MIN_COFFEE_PRICE) {
                      return `Coffee price must be at least ₹${MIN_COFFEE_PRICE}.`;
                    }
                    if (value > MAX_COFFEE_PRICE) {
                      return `Coffee price cannot be more than ₹${MAX_COFFEE_PRICE}.`;
                    }
                    return true;
                  },
                  onChange: () => {
                    setRequestError(null);
                    setSuccessMessage(null);
                  },
                })}
              />
              {errors.coffeePrice ? (
                <p
                  id="creator-coffee-price-error"
                  className="mt-1.5 text-body-small text-danger"
                  role="alert"
                >
                  {errors.coffeePrice.message}
                </p>
              ) : (
                <p
                  id="creator-coffee-price-help"
                  className="mt-1.5 text-body-small text-muted"
                >
                  Default support amount seen by supporters (₹{MIN_COFFEE_PRICE}–₹{MAX_COFFEE_PRICE}).
                </p>
              )}
            </div>

            {/* Status messages */}
            {requestError && (
              <div
                className="rounded-card border border-danger-border bg-danger-surface px-5 py-4 animate-fade-in"
                role="alert"
              >
                <p className="text-body-small font-medium text-danger-foreground">{requestError}</p>
              </div>
            )}

            {successMessage && (
              <div
                className="rounded-card border border-success-border bg-success-surface px-5 py-4 animate-fade-in"
                role="status"
              >
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-success-foreground shrink-0">
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.29a.75.75 0 00-1.06-1.06L7 7.59 5.65 6.24a.75.75 0 00-1.06 1.06l1.88 1.88a.75.75 0 001.06 0l3.88-3.89z" />
                  </svg>
                  <p className="text-body-small font-medium text-success-foreground">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-border-subtle pt-5">
              {isDirty && (
                <p className="text-body-small text-primary animate-fade-in">
                  You have unsaved changes
                </p>
              )}
              <div className="ml-auto">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-button-min-width"
                >
                  {isSaving && (
                    <span
                      aria-hidden="true"
                      className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                    />
                  )}
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default CreatorProfilePage;