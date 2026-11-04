import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useGetCreatorProfileQuery,
  useUpdateCreatorProfileMutation,
} from "../features/creator/api/creator.api";
import type { UpdateCreatorProfileRequest } from "../features/creator/types/creator.types";
import { getAuthFormErrorDetails } from "../features/auth/utils/authFormErrors";
import Button from "../shared/ui/Button";

interface CreatorProfileFormValues {
  name: string;
  bio: string;
  avatarUrl: string;
  coffeePrice: number;
  // Extended fields
  instagram?: string;
  youtube?: string;
  twitter?: string;
  website?: string;
  goalTitle?: string;
  goalTarget?: number;
  showGoal?: boolean;
  thankYouMessage?: string;
  allowPublicMessages?: boolean;
}

const MIN_COFFEE_PRICE = 20;
const MAX_COFFEE_PRICE = 500;
const PRESET_AMOUNTS = [50, 100, 250, 500];

type TabId = "profile" | "pricing" | "goal" | "payouts" | "appearance";

const CreatorProfilePage = () => {
  const {
    data: profileResponse,
    error: profileError,
    isError: hasProfileError,
    isFetching: isFetchingProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetCreatorProfileQuery();

  const [updateCreatorProfile, updateProfileState] = useUpdateCreatorProfileMutation();
  const [requestError, setRequestError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [activeColorTheme, setActiveColorTheme] = useState("forest");

  const creator = profileResponse?.data.creator;
  const isSaving = updateProfileState.isLoading;

  const profileRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const payoutsRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreatorProfileFormValues>({
    defaultValues: {
      name: "",
      bio: "",
      avatarUrl: "",
      coffeePrice: 100,
      instagram: "",
      youtube: "",
      twitter: "",
      website: "",
      goalTitle: "New studio mic & graphic tablet",
      goalTarget: 15000,
      showGoal: true,
      thankYouMessage:
        "Thank you so much for the coffee! You are directly funding my creative journey.",
      allowPublicMessages: true,
    },
  });

  // Watch form fields for the live mobile preview
  const watchName = watch("name");
  const watchBio = watch("bio");
  const watchAvatarUrl = watch("avatarUrl");
  const watchCoffeePrice = watch("coffeePrice");
  const watchGoalTitle = watch("goalTitle");
  const watchGoalTarget = watch("goalTarget");
  const watchShowGoal = watch("showGoal");

  // Load creator profile directly from server
  useEffect(() => {
    if (!creator) return;

    reset({
      name: creator.name ?? "",
      bio: creator.bio ?? "",
      avatarUrl: creator.avatarUrl ?? "",
      coffeePrice: creator.coffeePrice ?? 100,
      instagram: creator.socialLinks?.instagram ?? "",
      youtube: creator.socialLinks?.youtube ?? "",
      twitter: creator.socialLinks?.twitter ?? "",
      website: creator.socialLinks?.website ?? "",
      goalTitle: creator.goal?.title ?? "New studio mic & graphic tablet",
      goalTarget: creator.goal?.targetAmount ?? 15000,
      showGoal: creator.goal?.showGoal ?? true,
      thankYouMessage:
        creator.thankYouMessage ??
        "Thank you so much for the coffee! You are directly funding my creative journey.",
      allowPublicMessages:
        creator.allowPublicMessages ?? true,
    });
  }, [creator, reset]);

  const scrollToSection = (tab: TabId) => {
    setActiveTab(tab);
    const targetMap: Record<TabId, React.RefObject<HTMLDivElement | null>> = {
      profile: profileRef,
      pricing: pricingRef,
      goal: goalRef,
      payouts: payoutsRef,
      appearance: appearanceRef,
    };
    targetMap[tab]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleProfileUpdate: SubmitHandler<CreatorProfileFormValues> = async (values) => {
    setRequestError(null);
    setSuccessMessage(null);

    try {
      const payload: UpdateCreatorProfileRequest = {
        name: values.name.trim(),
        bio: values.bio?.trim() ?? "",
        avatarUrl: values.avatarUrl?.trim() || "https://ik.imagekit.io/hnoglyswo0/user-avatar.webp",
        coffeePrice: Number(values.coffeePrice),
        socialLinks: {
          instagram: values.instagram?.trim() ?? "",
          youtube: values.youtube?.trim() ?? "",
          twitter: values.twitter?.trim() ?? "",
          website: values.website?.trim() ?? "",
        },
        goal: {
          title: values.goalTitle?.trim() ?? "",
          targetAmount: Number(values.goalTarget ?? 15000),
          showGoal: Boolean(values.showGoal),
        },
        thankYouMessage: values.thankYouMessage?.trim() ?? "",
        allowPublicMessages: Boolean(values.allowPublicMessages),
      };

      const response = await updateCreatorProfile(payload).unwrap();
      const updatedCreator = response.data.creator;

      reset({
        name: updatedCreator.name,
        bio: updatedCreator.bio ?? "",
        avatarUrl: updatedCreator.avatarUrl ?? "",
        coffeePrice: updatedCreator.coffeePrice ?? 100,
        instagram: updatedCreator.socialLinks?.instagram ?? "",
        youtube: updatedCreator.socialLinks?.youtube ?? "",
        twitter: updatedCreator.socialLinks?.twitter ?? "",
        website: updatedCreator.socialLinks?.website ?? "",
        goalTitle: updatedCreator.goal?.title ?? "",
        goalTarget: updatedCreator.goal?.targetAmount ?? 15000,
        showGoal: updatedCreator.goal?.showGoal ?? true,
        thankYouMessage: updatedCreator.thankYouMessage ?? "",
        allowPublicMessages: updatedCreator.allowPublicMessages ?? true,
      });

      setSuccessMessage("Profile settings updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error) {
      const details = getAuthFormErrorDetails(error);
      setRequestError(details.message);

      if (details.fieldErrors.name) {
        setError("name", { type: "server", message: details.fieldErrors.name });
      }
      if (details.fieldErrors.bio) {
        setError("bio", { type: "server", message: details.fieldErrors.bio });
      }
      if (details.fieldErrors.avatarUrl) {
        setError("avatarUrl", { type: "server", message: details.fieldErrors.avatarUrl });
      }
      if (details.fieldErrors.coffeePrice) {
        setError("coffeePrice", { type: "server", message: details.fieldErrors.coffeePrice });
      }
    }
  };

  const handleDiscardChanges = () => {
    if (!creator) return;
    reset();
    setRequestError(null);
    setSuccessMessage(null);
  };

  const profileErrorMessage = hasProfileError
    ? getAuthFormErrorDetails(profileError).message
    : "Creator profile is unavailable.";

  // Loading State
  if (isLoadingProfile) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-surface px-4 py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3" role="status">
          <span className="w-8 h-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
          <p className="font-label-md text-label-md text-on-surface-variant">Loading profile settings…</p>
        </div>
      </main>
    );
  }

  // Error State
  if (!creator) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-surface px-4 py-12">
        <section className="mx-auto max-w-lg text-center bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/30">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <span className="material-symbols-outlined text-[24px]">error_outline</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary">Couldn&apos;t load profile</h1>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{profileErrorMessage}</p>
          <Button
            type="button"
            density="compact"
            onClick={() => void refetchProfile()}
            disabled={isFetchingProfile}
            className="mt-6"
          >
            {isFetchingProfile ? "Loading…" : "Try again"}
          </Button>
        </section>
      </main>
    );
  }

  const bioLength = watchBio?.length ?? 0;
  const currentPrice = Number(watchCoffeePrice) || 100;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-surface text-on-surface font-body-md text-body-md px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        {/* Top Header Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-2 border-b border-outline-variant/20">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-tertiary-fixed/70 text-primary px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-1.5">
              <span className="material-symbols-outlined text-[15px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                settings
              </span>
              <span>Creator Settings</span>
            </div>
            <h1 className="font-headline-lg text-2xl sm:text-headline-lg text-primary tracking-tight">
              Profile Settings
            </h1>
            <p className="font-body-md text-xs sm:text-body-md text-on-surface-variant mt-0.5">
              Manage how supporters see you across the supportme platform.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={`/@${encodeURIComponent(creator.username)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-surface-container-lowest hover:bg-surface-container-low text-primary border border-outline-variant/40 font-label-md text-xs sm:text-label-md font-semibold shadow-2xs transition-all active:scale-98"
            >
              <span>Public Profile</span>
              <span className="text-emerald-700 font-normal">/@{creator.username}</span>
              <span className="material-symbols-outlined text-[15px] sm:text-[16px] leading-none">open_in_new</span>
            </Link>
          </div>
        </div>

        {/* Global Notifications */}
        {requestError && (
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-center gap-3 text-rose-800 animate-fade-in"
            role="alert"
          >
            <span className="material-symbols-outlined text-[20px] shrink-0 text-rose-600">error</span>
            <p className="font-body-sm text-body-sm font-medium">{requestError}</p>
          </div>
        )}

        {successMessage && (
          <div
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-3 text-emerald-900 animate-fade-in"
            role="status"
          >
            <span className="material-symbols-outlined text-[20px] shrink-0 text-emerald-600">task_alt</span>
            <p className="font-body-sm text-body-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Main 3-Column Layout: Sidebar (3) + Form Cards (6) + Live Mobile Mockup (3) */}
        <form
          noValidate
          onSubmit={handleSubmit(handleProfileUpdate)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* ==================== LEFT COLUMN: Navigation Sidebar ==================== */}
          <aside className="lg:col-span-3 space-y-3 lg:space-y-4 lg:sticky lg:top-20">
            <nav
              aria-label="Settings Sections"
              className="flex lg:flex-col overflow-x-auto gap-1 sm:gap-1.5 p-1.5 sm:p-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs no-scrollbar"
            >
              <button
                type="button"
                onClick={() => scrollToSection("profile")}
                className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 font-label-md text-xs sm:text-label-md transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-primary text-on-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] leading-none">person</span>
                <span>Profile Details</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("pricing")}
                className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 font-label-md text-xs sm:text-label-md transition-colors cursor-pointer ${
                  activeTab === "pricing"
                    ? "bg-primary text-on-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] leading-none">local_cafe</span>
                <span>Pricing &amp; Tipping</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("goal")}
                className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 font-label-md text-xs sm:text-label-md transition-colors cursor-pointer ${
                  activeTab === "goal"
                    ? "bg-primary text-on-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] leading-none">flag</span>
                <span>Fundraising Goal</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("payouts")}
                className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 font-label-md text-xs sm:text-label-md transition-colors cursor-pointer ${
                  activeTab === "payouts"
                    ? "bg-primary text-on-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] leading-none">account_balance</span>
                <span>Payouts &amp; Bank</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("appearance")}
                className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 font-label-md text-xs sm:text-label-md transition-colors cursor-pointer ${
                  activeTab === "appearance"
                    ? "bg-primary text-on-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px] leading-none">palette</span>
                <span>Page Appearance</span>
              </button>
            </nav>

            {/* Creator Tip Callout (Desktop) */}
            <div className="hidden lg:block bg-tertiary-fixed/60 rounded-2xl p-4.5 border border-outline-variant/30 space-y-2">
              <div className="flex items-center gap-1.5 text-primary font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[18px] text-secondary-container leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lightbulb
                </span>
                <span>Creator Tip</span>
              </div>
              <p className="font-body-sm text-body-sm text-primary/85 leading-relaxed">
                Creators who set clear fundraising goals and customized thank-you notes receive{" "}
                <strong className="text-primary font-semibold">40% more repeat patrons</strong>.
              </p>
            </div>

            {/* Razorpay Merchant Badge (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant shadow-2xs font-label-sm text-label-sm">
              <span
                className="material-symbols-outlined text-emerald-600 text-[18px] leading-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span>Verified Indian Merchant (Razorpay Route)</span>
            </div>
          </aside>

          {/* ==================== CENTER COLUMN: Main Settings Form ==================== */}
          <div className="lg:col-span-6 space-y-6">
            {/* CARD 1: Profile Details */}
            <section
              ref={profileRef}
              className="bg-surface-container-lowest rounded-[20px] p-6 lg:p-7 shadow-[0_8px_30px_rgba(15,61,46,0.04)] border border-outline-variant/30 space-y-6"
              aria-labelledby="profile-heading"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 id="profile-heading" className="font-headline-sm text-headline-sm text-primary font-bold">
                    Profile Details
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Your public identity and presentation across the supportme network.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  Step 1 of 4
                </span>
              </div>

              {/* Avatar Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative shrink-0">
                    {watchAvatarUrl ? (
                      <img
                        src={watchAvatarUrl}
                        alt={creator.name}
                        className="w-20 h-20 rounded-full object-cover shadow-sm ring-4 ring-surface-container-lowest"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://ik.imagekit.io/hnoglyswo0/user-avatar.webp";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-2xl ring-4 ring-surface-container-lowest shadow-sm">
                        {creator.name[0]?.toUpperCase() ?? "C"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setValue("avatarUrl", "https://ik.imagekit.io/hnoglyswo0/user-avatar.webp", {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-surface-container-highest hover:bg-surface-container-high text-primary font-label-sm text-xs sm:text-label-sm font-semibold transition-colors cursor-pointer"
                      >
                        Reset to default avatar
                      </button>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Square JPG, PNG, or WebP. Public image URL supported.
                    </p>
                  </div>
                </div>

                {/* Avatar URL Input - Always Mounted & Synced */}
                <div className="space-y-1.5 pt-2 border-t border-outline-variant/20">
                  <label htmlFor="creator-avatar" className="block font-label-sm text-label-sm font-bold text-primary">
                    Avatar Image URL
                  </label>
                  <input
                    id="creator-avatar"
                    type="url"
                    placeholder="https://ik.imagekit.io/hnoglyswo0/user-avatar.webp"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-body-sm text-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs"
                    {...register("avatarUrl", {
                      validate: (val) => {
                        if (!val || !val.trim()) return true;
                        try {
                          const url = new URL(val.trim());
                          return url.protocol === "http:" || url.protocol === "https:" || "Must be valid HTTP/HTTPS URL";
                        } catch {
                          return "Invalid image URL";
                        }
                      },
                    })}
                  />
                  {errors.avatarUrl && (
                    <p className="text-rose-600 font-label-sm text-label-sm">{errors.avatarUrl.message}</p>
                  )}
                </div>
              </div>

              {/* Form Fields: Name, Username, Bio */}
              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label htmlFor="creator-display-name" className="block font-label-md text-label-md text-primary font-bold mb-1.5">
                    Display Name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="creator-display-name"
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md border border-outline-variant/40 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                      {...register("name", {
                        required: "Display name is required.",
                        validate: (val) => {
                          const len = val.trim().length;
                          return (len >= 2 && len <= 50) || "Name must be 2 to 50 characters.";
                        },
                      })}
                    />
                    <div className="absolute right-3 flex items-center text-primary" title="Verified Creator">
                      <span className="material-symbols-outlined text-[20px] text-emerald-600 leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-rose-600 font-label-sm text-label-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* Username & URL Handle (Fixed / Read-only with pill) */}
                <div>
                  <label htmlFor="creator-username" className="block font-label-md text-label-md text-primary font-bold mb-1.5">
                    Username &amp; URL Handle
                  </label>
                  <div className="flex items-center rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xs overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="px-3.5 py-2.5 bg-surface-container text-on-surface-variant font-label-md text-label-md font-semibold select-none border-r border-outline-variant/20">
                      supportme.com/@
                    </span>
                    <input
                      id="creator-username"
                      type="text"
                      value={creator.username}
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2.5 bg-transparent text-primary font-body-md text-body-md font-medium cursor-not-allowed opacity-90"
                    />
                    <span className="pr-3.5 shrink-0 flex items-center gap-1 text-emerald-700 font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[16px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span>Active</span>
                    </span>
                  </div>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    To modify your unique URL handle, contact support desk.
                  </p>
                </div>

                {/* Creator Bio / Tagline with live counter */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="creator-bio" className="font-label-md text-label-md text-primary font-bold">
                      Creator Bio / Tagline
                    </label>
                    <span
                      className={`font-label-sm text-label-sm ${
                        bioLength > 160 ? "text-rose-600 font-bold" : "text-on-surface-variant"
                      }`}
                    >
                      {bioLength} / 160
                    </span>
                  </div>
                  <textarea
                    id="creator-bio"
                    rows={3}
                    placeholder="Illustrator & Visual Essayist creating guides on drawing, color theory, and digital art."
                    className="w-full p-3.5 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md border border-outline-variant/40 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                    {...register("bio", {
                      maxLength: {
                        value: 160,
                        message: "Bio must be 160 characters or fewer.",
                      },
                    })}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-rose-600 font-label-sm text-label-sm">{errors.bio.message}</p>
                  )}
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Shown prominently on your creator card across desktop &amp; mobile feeds.
                  </p>
                </div>

                {/* Social & Portfolio Links Grid */}
                <div className="pt-2">
                  <label className="block font-label-md text-label-md text-primary font-bold mb-2">
                    Social &amp; Portfolio Links
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Instagram */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="font-label-sm text-label-sm text-on-surface-variant w-20 font-semibold">
                        Instagram
                      </span>
                      <input
                        type="text"
                        placeholder="@username"
                        className="flex-1 bg-transparent text-primary font-body-sm text-body-sm focus:outline-none placeholder:text-on-surface-variant/40"
                        {...register("instagram")}
                      />
                    </div>

                    {/* YouTube */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="font-label-sm text-label-sm text-on-surface-variant w-20 font-semibold">
                        YouTube
                      </span>
                      <input
                        type="text"
                        placeholder="channel or @handle"
                        className="flex-1 bg-transparent text-primary font-body-sm text-body-sm focus:outline-none placeholder:text-on-surface-variant/40"
                        {...register("youtube")}
                      />
                    </div>

                    {/* X / Twitter */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="font-label-sm text-label-sm text-on-surface-variant w-20 font-semibold">
                        X / Twitter
                      </span>
                      <input
                        type="text"
                        placeholder="@handle"
                        className="flex-1 bg-transparent text-primary font-body-sm text-body-sm focus:outline-none placeholder:text-on-surface-variant/40"
                        {...register("twitter")}
                      />
                    </div>

                    {/* Website */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="font-label-sm text-label-sm text-on-surface-variant w-20 font-semibold">
                        Website
                      </span>
                      <input
                        type="text"
                        placeholder="yourportfolio.in"
                        className="flex-1 bg-transparent text-primary font-body-sm text-body-sm focus:outline-none placeholder:text-on-surface-variant/40"
                        {...register("website")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CARD 2: Coffee & Pricing Settings */}
            <section
              ref={pricingRef}
              className="bg-surface-container-lowest rounded-[20px] p-6 lg:p-7 shadow-[0_8px_30px_rgba(15,61,46,0.04)] border border-outline-variant/30 space-y-6"
              aria-labelledby="pricing-heading"
            >
              <div>
                <h2 id="pricing-heading" className="font-headline-sm text-headline-sm text-primary font-bold">
                  Coffee Price &amp; Support Settings
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Customize how supporters buy you filter coffees or chai in Indian Rupees (₹).
                </p>
              </div>

              <div className="space-y-5">
                {/* Base Price per Coffee */}
                <div>
                  <label className="block font-label-md text-label-md text-primary font-bold mb-2">
                    Base Price per Coffee (₹)
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Fixed Prefix Currency Input */}
                    <div className="flex items-center rounded-xl bg-surface-container-low border border-outline-variant/40 px-3.5 py-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="font-currency-display text-[26px] text-primary font-bold mr-1">₹</span>
                      <input
                        type="number"
                        min={MIN_COFFEE_PRICE}
                        max={MAX_COFFEE_PRICE}
                        step={1}
                        className="w-24 bg-transparent font-currency-display text-[26px] text-primary font-bold focus:outline-none"
                        {...register("coffeePrice", {
                          required: "Coffee price is required.",
                          valueAsNumber: true,
                          validate: (val) => {
                            if (!val || Number.isNaN(val)) return "Enter a valid amount";
                            if (val < MIN_COFFEE_PRICE) return `Min ₹${MIN_COFFEE_PRICE}`;
                            if (val > MAX_COFFEE_PRICE) return `Max ₹${MAX_COFFEE_PRICE}`;
                            return true;
                          },
                        })}
                      />
                    </div>

                    {/* Fast Preset Selectors */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_AMOUNTS.map((amt) => {
                        const isSelected = currentPrice === amt;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              setValue("coffeePrice", amt, { shouldDirty: true, shouldValidate: true });
                            }}
                            className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary text-on-primary font-bold shadow-xs scale-102"
                                : "bg-surface-container-low text-primary hover:bg-surface-container-high"
                            }`}
                          >
                            ₹{amt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {errors.coffeePrice && (
                    <p className="mt-1.5 text-rose-600 font-label-sm text-label-sm">{errors.coffeePrice.message}</p>
                  )}
                  <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
                    Recommended for creators &amp; artists in India: ₹50 – ₹500.
                  </p>
                </div>

                {/* Automated Supporter Thank-You Note */}
                <div>
                  <label htmlFor="thank-you-note" className="block font-label-md text-label-md text-primary font-bold mb-1.5">
                    Automated Supporter Thank-You Note
                  </label>
                  <textarea
                    id="thank-you-note"
                    rows={3}
                    placeholder="Thank you so much for the coffee! You are directly funding my creative series."
                    className="w-full p-3.5 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md border border-outline-variant/40 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                    {...register("thankYouMessage")}
                  />
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    Immediately shown on the success screen after UPI / card payment approval.
                  </p>
                </div>

                {/* Supporter Messages Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="space-y-0.5 pr-4">
                    <span className="font-label-md text-label-md text-primary font-bold block">
                      Allow public messages with tips
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      Patron messages appear on your public wall unless marked private by the supporter.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register("allowPublicMessages")}
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>
            </section>

            {/* CARD 3: Creator Goal */}
            <section
              ref={goalRef}
              className="bg-surface-container-lowest rounded-[20px] p-6 lg:p-7 shadow-[0_8px_30px_rgba(15,61,46,0.04)] border border-outline-variant/30 space-y-6"
              aria-labelledby="goal-heading"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 id="goal-heading" className="font-headline-sm text-headline-sm text-primary font-bold">
                    Fundraising Goal
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Set a visible community milestone to motivate your supporters.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-primary font-label-sm text-label-sm font-semibold">
                  Milestone
                </span>
              </div>

              <div className="space-y-4">
                {/* Goal Title */}
                <div>
                  <label htmlFor="goal-title" className="block font-label-md text-label-md text-primary font-bold mb-1.5">
                    Goal Title
                  </label>
                  <input
                    id="goal-title"
                    type="text"
                    placeholder="e.g. New podcast mic & drawing display"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md border border-outline-variant/40 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    {...register("goalTitle")}
                  />
                </div>

                {/* Target Amount */}
                <div>
                  <label htmlFor="goal-target" className="block font-label-md text-label-md text-primary font-bold mb-1.5">
                    Target Amount in ₹
                  </label>
                  <div className="flex items-center rounded-xl bg-surface-container-lowest border border-outline-variant/40 px-3.5 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 max-w-xs">
                    <span className="font-currency-display text-primary font-bold mr-1.5 text-lg">₹</span>
                    <input
                      id="goal-target"
                      type="number"
                      min={100}
                      step={500}
                      className="w-full bg-transparent font-currency-display text-primary font-bold focus:outline-none text-lg"
                      {...register("goalTarget", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {/* Goal Progress Preview */}
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                  <div className="flex justify-between items-baseline text-xs font-semibold">
                    <span className="text-primary font-label-md text-label-md">
                      Preview: {watchGoalTitle || "Creator Goal"}
                    </span>
                    <span className="text-emerald-700 font-label-md text-label-md font-bold">
                      Goal: ₹{(watchGoalTarget || 15000).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full w-1/3" />
                  </div>
                </div>

                {/* Toggle Show Goal */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="space-y-0.5 pr-4">
                    <span className="font-label-md text-label-md text-primary font-bold block">
                      Show goal on public page
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      Supporters can see real-time progress toward your milestone.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register("showGoal")}
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>
            </section>

            {/* CARD 4: Razorpay Payment Gateway & Payouts */}
            <section
              ref={payoutsRef}
              className="bg-surface-container-lowest rounded-[20px] p-6 lg:p-7 shadow-[0_8px_30px_rgba(15,61,46,0.04)] border border-outline-variant/30 space-y-5"
              aria-labelledby="payouts-heading"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 id="payouts-heading" className="font-headline-sm text-headline-sm text-primary font-bold">
                    Payment Gateway &amp; Payouts
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Integrated Razorpay Route automated settlements for UPI and cards.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span>Connected</span>
                </span>
              </div>

              {/* Bank Account Info Card */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-2xs">
                    ₹
                  </div>
                  <div>
                    <div className="font-label-lg text-label-lg font-bold text-primary">
                      Indian Bank Account Linked
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Settlement Route • Direct UPI &amp; IMPS payout
                    </div>
                    <div className="font-label-sm text-label-sm text-emerald-700 font-semibold mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Instant &amp; Daily T+1 Settlement Active</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-primary font-label-sm text-label-sm font-semibold shadow-2xs">
                    <span className="material-symbols-outlined text-[16px] leading-none text-emerald-700">lock</span>
                    <span>PCI-DSS Secured</span>
                  </span>
                </div>
              </div>

              {/* Platform Fee & Settlement Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Platform Fee
                  </span>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">
                    0% Platform Fee
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    100% of your tips go directly to your linked account.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Next Settlement Batch
                  </span>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">
                    Tonight, 11:30 PM IST
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Auto-transferred directly to your verified bank account.
                  </p>
                </div>
              </div>
            </section>

            {/* CARD 5: Page Appearance & Branding */}
            <section
              ref={appearanceRef}
              className="bg-surface-container-lowest rounded-[20px] p-6 lg:p-7 shadow-[0_8px_30px_rgba(15,61,46,0.04)] border border-outline-variant/30 space-y-5"
              aria-labelledby="appearance-heading"
            >
              <div>
                <h2 id="appearance-heading" className="font-headline-sm text-headline-sm text-primary font-bold">
                  Page Appearance &amp; Aesthetics
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Set the visual tone of your creator page matching the supportme design tokens.
                </p>
              </div>

              {/* Cover Banner Preview */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-primary font-bold">
                  Cover Artwork Banner
                </label>
                <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-2xs border border-outline-variant/20 bg-gradient-to-r from-[#00261a] via-[#0f3d2e] to-[#204a37]">
                  <div className="absolute inset-0 bg-cover bg-center opacity-85" />
                  <div className="absolute bottom-3 left-4 text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    supportme Botanical Heritage Accent
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Optimal dimensions: 1200x320px. Responsive across mobile viewports.
                </p>
              </div>

              {/* Palette Swatches */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-primary font-bold">
                  Signature Accent Tone
                </label>
                <div className="flex items-center gap-3">
                  {/* Forest Green (Active) */}
                  <button
                    type="button"
                    onClick={() => setActiveColorTheme("forest")}
                    aria-label="Theme: Forest Green"
                    className={`w-9 h-9 rounded-full bg-[#00261a] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      activeColorTheme === "forest" ? "ring-4 ring-[#00261a]/30 scale-105" : ""
                    }`}
                  >
                    {activeColorTheme === "forest" && (
                      <span className="material-symbols-outlined text-white text-[18px]">check</span>
                    )}
                  </button>

                  {/* Terracotta */}
                  <button
                    type="button"
                    onClick={() => setActiveColorTheme("terracotta")}
                    aria-label="Theme: Terracotta"
                    className={`w-9 h-9 rounded-full bg-[#A2482B] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      activeColorTheme === "terracotta" ? "ring-4 ring-[#A2482B]/30 scale-105" : ""
                    }`}
                  >
                    {activeColorTheme === "terracotta" && (
                      <span className="material-symbols-outlined text-white text-[18px]">check</span>
                    )}
                  </button>

                  {/* Deep Teal */}
                  <button
                    type="button"
                    onClick={() => setActiveColorTheme("teal")}
                    aria-label="Theme: Deep Teal"
                    className={`w-9 h-9 rounded-full bg-[#1C5B63] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      activeColorTheme === "teal" ? "ring-4 ring-[#1C5B63]/30 scale-105" : ""
                    }`}
                  >
                    {activeColorTheme === "teal" && (
                      <span className="material-symbols-outlined text-white text-[18px]">check</span>
                    )}
                  </button>

                  {/* Golden Amber */}
                  <button
                    type="button"
                    onClick={() => setActiveColorTheme("amber")}
                    aria-label="Theme: Golden Amber"
                    className={`w-9 h-9 rounded-full bg-[#fea619] flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      activeColorTheme === "amber" ? "ring-4 ring-[#fea619]/30 scale-105" : ""
                    }`}
                  >
                    {activeColorTheme === "amber" && (
                      <span className="material-symbols-outlined text-[#002116] text-[18px]">check</span>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ==================== RIGHT COLUMN: Interactive Live Preview ==================== */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 font-label-md text-label-md text-primary font-bold">
                <span className="material-symbols-outlined text-[18px] leading-none">devices</span>
                <span>Live Visitor Preview</span>
              </div>
              <span className="text-emerald-700 font-label-sm text-label-sm font-semibold bg-tertiary-fixed px-2.5 py-0.5 rounded-full">
                Interactive
              </span>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="w-full bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/40 overflow-hidden">
              {/* Phone Status Bar */}
              <div className="h-6 bg-surface-container-high flex items-center justify-between px-4">
                <span className="text-[10px] font-semibold text-on-surface-variant font-label-sm">9:41</span>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[12px] leading-none">wifi</span>
                  <span className="material-symbols-outlined text-[12px] leading-none">battery_full</span>
                </div>
              </div>

              {/* Micro Profile Preview */}
              <div className="bg-surface-bright space-y-4">
                {/* Banner & Avatar Ring */}
                <div className="relative">
                  <div className="w-full h-20 bg-gradient-to-r from-[#00261a] to-[#204a37]" />
                  <div className="absolute -bottom-6 left-4">
                    {watchAvatarUrl ? (
                      <img
                        src={watchAvatarUrl}
                        alt="Mini avatar preview"
                        className="w-13 h-13 rounded-full object-cover ring-2 ring-surface-container-lowest shadow"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-sm ring-2 ring-surface-container-lowest shadow">
                        {(watchName?.[0] || creator.name[0] || "C").toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info in Mini Card */}
                <div className="pt-6 px-4 space-y-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-headline-sm text-[16px] text-primary font-bold leading-tight truncate">
                      {watchName || creator.name}
                    </h3>
                    <span
                      className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <p className="font-label-sm text-[11px] text-on-surface-variant">
                    supportme.com/@{creator.username}
                  </p>
                  <p className="font-body-sm text-[12px] text-on-surface line-clamp-3 leading-relaxed pt-1">
                    {watchBio || creator.bio || "No bio added yet."}
                  </p>
                </div>

                {/* Mini Coffee Support Widget */}
                <div className="mx-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-[#4A2C1A] text-[16px] leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      local_cafe
                    </span>
                    <span className="font-label-md text-label-md font-bold text-primary truncate">
                      Buy {watchName?.split(" ")[0] || "Creator"} a coffee
                    </span>
                  </div>

                  {/* Multipliers */}
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="py-1 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold">1</div>
                    <div className="py-1 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold">3</div>
                    <div className="py-1 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold">5</div>
                    <div className="py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold">10</div>
                  </div>

                  {/* Simulated CTA Button */}
                  <button
                    type="button"
                    className="w-full py-2 rounded-full bg-secondary-container text-[#002116] font-label-md text-label-md font-bold shadow-xs flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px] leading-none">local_cafe</span>
                    <span>Support ₹{currentPrice}</span>
                  </button>
                </div>

                {/* Mini Goal Preview */}
                {watchShowGoal && (
                  <div className="mx-4 mb-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-[10px] font-label-sm font-bold text-primary">
                      <span className="truncate">{watchGoalTitle || "Goal"}</span>
                      <span className="text-emerald-700">33%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-1/3" />
                    </div>
                  </div>
                )}

                {/* Bottom View Link */}
                <div className="p-2.5 bg-surface-container text-center border-t border-outline-variant/20">
                  <Link
                    to={`/@${encodeURIComponent(creator.username)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-semibold hover:underline"
                  >
                    <span>Test Live Page in New Tab</span>
                    <span className="material-symbols-outlined text-[13px] leading-none">open_in_new</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* ==================== FLOATING BOTTOM SAVE / DISCARD DOCK ==================== */}
          <div className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none">
            <div className="max-w-3xl mx-auto pointer-events-auto">
              <div
                className={`bg-primary text-on-primary rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-2xl flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 border border-white/10 ${
                  isDirty ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-xs sm:text-label-md font-bold text-white truncate">Unsaved changes</span>
                    <span className="hidden sm:inline font-label-sm text-xs text-white/70">
                      You have modified your settings
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDiscardChanges}
                    disabled={isSaving}
                    className="px-3 sm:px-4 py-1.5 rounded-full text-white/80 hover:text-white font-label-md text-xs sm:text-label-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-secondary-container hover:brightness-105 text-[#002116] font-label-md text-xs sm:text-label-md font-bold shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#002116]/30 border-t-[#002116] animate-spin rounded-full" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px] leading-none">check</span>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatorProfilePage;
