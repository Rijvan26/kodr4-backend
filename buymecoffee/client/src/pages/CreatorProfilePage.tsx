import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useGetCreatorProfileQuery,
  useUpdateCreatorProfileMutation,
} from "../features/creator/api/creator.api";
import { getAuthFormErrorDetails } from "../features/auth/utils/authFormErrors";
import Button from "../shared/ui/Button";
import Card from "../shared/ui/Card";
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
    formState: { errors },
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
      <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide">
        <p className="mx-auto max-w-3xl text-body text-muted" role="status">
          Loading profile...
        </p>
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide">
        <section className="mx-auto max-w-3xl" aria-labelledby="profile-heading">
          <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
            CREATOR ACCOUNT
          </p>
          <h1
            id="profile-heading"
            className="mt-3 font-serif text-page-title-mobile text-foreground sm:text-heading"
          >
            Creator profile
          </h1>
          <p className="mt-5 rounded-card border border-danger-border bg-danger-surface px-control-x py-control-y text-body text-danger-foreground" role="alert">
            {profileErrorMessage}
          </p>
          <Button
            type="button"
            density="compact"
            onClick={() => void refetchProfile()}
            disabled={isFetchingProfile}
            className="mt-5"
          >
            {isFetchingProfile ? "Loading..." : "Try again"}
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-page-gutter py-page-block text-foreground sm:px-page-gutter-wide sm:py-page-block-wide">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
            CREATOR ACCOUNT
          </p>
          <h1 className="mt-3 font-serif text-page-title-mobile text-foreground sm:text-heading">
            Creator profile
          </h1>
          <p className="mt-2 text-body-relaxed text-muted">
            Manage the details shown on your creator account.
          </p>
        </header>

        <Card
          className="p-panel sm:p-panel-wide"
          aria-labelledby="profile-details-heading"
        >
          <h2
            id="profile-details-heading"
            className="text-section-heading text-foreground"
          >
            Profile details
          </h2>

          <dl className="mt-5 grid gap-4 border-b border-border-subtle pb-6 sm:grid-cols-3">
            <div>
              <dt className="text-meta text-muted">Username</dt>
              <dd className="mt-1 text-label text-surface-foreground">
                @{creator.username}
              </dd>
            </div>
            <div>
              <dt className="text-meta text-muted">Email</dt>
              <dd className="mt-1 break-all text-label text-surface-foreground">
                {creator.email}
              </dd>
            </div>
            <div>
              <dt className="text-meta text-muted">Default coffee price</dt>
              <dd className="mt-1 text-label text-surface-foreground">
                ☕ ₹{creator.coffeePrice}
              </dd>
            </div>
          </dl>

          <form
            className="mt-6 space-y-form-gap"
            noValidate
            onSubmit={handleSubmit(handleProfileUpdate)}
          >
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

            {requestError && (
              <p
                className="rounded-card border border-danger-border bg-danger-surface px-control-x py-control-y text-body text-danger-foreground"
                role="alert"
              >
                {requestError}
              </p>
            )}

            {successMessage && (
              <p
                className="rounded-card border border-success-border bg-success-surface px-control-x py-control-y text-body text-success"
                role="status"
              >
                {successMessage}
              </p>
            )}

            <div className="flex justify-end border-t border-border-subtle pt-5">
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
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default CreatorProfilePage;