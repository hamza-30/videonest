import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LuCamera } from "react-icons/lu";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import useUser from "../hooks/useUser";
import ImagePreviewModal from "../components/ImagePreviewModal";

function EditChannel() {
  const { user } = useAuthContext();
  const {
    updateChannelDetails,
    updateUserAvatar,
    updateUserCoverImage,
    changeUserPassword,
    channelEditLoading,
    avatarLoading,
    coverImageLoading,
    passwordChangedLoading,
  } = useUser();

  // Active tab: "info" | "password"
  const [activeTab, setActiveTab] = useState("info");

  // Pending state: { file, previewUrl } | null
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [pendingCover, setPendingCover] = useState(null);

  // Which modal is open: "avatar" | "cover" | null
  const [modalOpen, setModalOpen] = useState(null);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // ── Channel information form ──────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
    },
  });

  // ── Change password form ──────────────────────────────────────────────────
  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    watch: watchPw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm();

  // ── Image selection ──────────────────────────────────────────────────────
  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "avatar") {
      setPendingAvatar({ file, previewUrl });
      setModalOpen("avatar");
    } else {
      setPendingCover({ file, previewUrl });
      setModalOpen("cover");
    }

    // Reset input so the same file can be reselected later if needed
    e.target.value = "";
  };

  // ── Modal cancel ─────────────────────────────────────────────────────────
  const handleModalCancel = () => {
    if (modalOpen === "avatar" && pendingAvatar) {
      URL.revokeObjectURL(pendingAvatar.previewUrl);
      setPendingAvatar(null);
    }
    if (modalOpen === "cover" && pendingCover) {
      URL.revokeObjectURL(pendingCover.previewUrl);
      setPendingCover(null);
    }
    setModalOpen(null);
  };

  // ── Modal confirm (upload) ────────────────────────────────────────────────
  const handleModalConfirm = async () => {
    if (modalOpen === "avatar" && pendingAvatar) {
      const formData = new FormData();
      formData.append("avatar", pendingAvatar.file);
      await updateUserAvatar(formData);
      URL.revokeObjectURL(pendingAvatar.previewUrl);
      setPendingAvatar(null);
    } else if (modalOpen === "cover" && pendingCover) {
      const formData = new FormData();
      formData.append("coverImage", pendingCover.file);
      await updateUserCoverImage(formData);
      URL.revokeObjectURL(pendingCover.previewUrl);
      setPendingCover(null);
    }
    setModalOpen(null);
  };

  // ── Account details form submit ───────────────────────────────────────────
  const onSubmit = ({ fullName, email }) => {
    updateChannelDetails({ fullName, email });
  };

  // ── Password form submit ──────────────────────────────────────────────────
  const onPasswordSubmit = async ({ oldPassword, newPassword }) => {
    await changeUserPassword({ oldPassword, newPassword });
    resetPw();
  };

  // Resolve displayed images: show local preview while modal is open,
  // otherwise fall back to the live AuthContext value.
  const displayedAvatar = pendingAvatar?.previewUrl ?? user?.avatar;
  const displayedCover = pendingCover?.previewUrl ?? user?.coverImage;

  return (
    <>
      {/* ── Cover + Avatar hero (mirrors ChannelInformation layout) ───────── */}
      <div>
        {/* Cover image */}
        <div className="relative h-48 min-w-full overflow-hidden bg-slate-200">
          {displayedCover ? (
            <img
              src={displayedCover}
              alt="Cover image"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-r from-slate-200 via-slate-100 to-slate-200" />
          )}

          {/* Camera overlay button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={coverImageLoading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/20 text-white disabled:cursor-not-allowed"
            aria-label="Change cover image"
            title="Change cover image"
          >
            <LuCamera className="text-2xl drop-shadow" aria-hidden="true" />
            <span className="text-xs font-medium drop-shadow">
              {coverImageLoading ? "Uploading…" : "Change cover"}
            </span>
          </button>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "cover")}
          />
        </div>

        {/* Avatar + info row */}
        <div className="relative flex flex-col items-stretch gap-4 px-4 pb-5 pt-20 sm:flex-row sm:items-center sm:px-8 sm:py-5 sm:pl-35">
          {/* Avatar */}
          <div className="absolute -top-9.5 left-3 z-10 sm:left-5">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
              {displayedAvatar ? (
                <img
                  src={displayedAvatar}
                  alt="Your avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-slate-200" />
              )}

              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarLoading}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/25 text-white rounded-full disabled:cursor-not-allowed"
                aria-label="Change avatar"
                title="Change avatar"
              >
                <LuCamera className="text-xl drop-shadow" aria-hidden="true" />
                <span className="text-[10px] font-medium drop-shadow">
                  {avatarLoading ? "…" : "Change"}
                </span>
              </button>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "avatar")}
            />
          </div>

          {/* Username & full name (read-only display) */}
          <div className="min-w-0 sm:flex-1">
            <h1 className="truncate text-xl font-bold text-slate-900">
              {user?.fullName}
            </h1>
            <p className="truncate text-sm text-slate-500">@{user?.username}</p>
          </div>

          {/* View channel button */}
          <Link
            to={`/channel/${user?.username}`}
            className="w-full shrink-0 rounded-lg border border-[#8132e5] px-4 py-2 text-center text-sm font-semibold text-[#8132e5] transition hover:bg-[#f1edfc] sm:w-auto"
          >
            View channel
          </Link>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8">
        <div
          role="tablist"
          aria-label="Edit channel sections"
          className="grid min-h-10 grid-cols-2 items-stretch rounded-xl bg-[#f5f5f5] p-1 max-w-lg"
        >
          {[
            { id: "info", label: "Channel Information" },
            { id: "password", label: "Change Password" },
          ].map(({ id, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(id)}
                className={`relative flex min-w-0 items-center justify-center rounded-lg px-2 text-[11px] font-medium leading-tight transition-colors sm:px-3 sm:text-sm ${
                  isActive
                    ? "bg-white text-[#8132e5] shadow-sm"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab panels ────────────────────────────────────────────────────── */}
      <div className="px-4 pb-10 sm:px-8">
        {/* Channel Information panel */}
        {activeTab === "info" && (
          <div className="mt-4 max-w-lg rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Channel details
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Update your display name and email address.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 flex flex-col gap-y-4"
            >
              {/* Full name */}
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="fullName"
                  className="text-[15px] text-slate-700"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-all duration-100 ease-out focus:border-transparent focus:ring-1 focus:ring-[#8132e5]"
                />
                {errors.fullName && (
                  <span className="text-xs text-red-600">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-y-1">
                <label htmlFor="email" className="text-[15px] text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-all duration-100 ease-out focus:border-transparent focus:ring-1 focus:ring-[#8132e5]"
                />
                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Username (read-only) */}
              <div className="flex flex-col gap-y-1">
                <label className="text-[15px] text-slate-700">Username</label>
                <input
                  type="text"
                  value={`@${user?.username ?? ""}`}
                  disabled
                  className="h-10 rounded-lg border border-gray-200 bg-slate-50 px-3 text-sm text-slate-400 outline-none cursor-not-allowed"
                />
                <span className="text-xs text-slate-400">
                  Usernames are unique and cannot be changed.
                </span>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={channelEditLoading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#8132e5] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#7024cf] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {channelEditLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password panel */}
        {activeTab === "password" && (
          <div className="mt-4 max-w-lg rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Change password
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Choose a strong password you haven&apos;t used before.
            </p>

            <form
              onSubmit={handleSubmitPw(onPasswordSubmit)}
              className="mt-5 flex flex-col gap-y-4"
            >
              {/* Old password */}
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="oldPassword"
                  className="text-[15px] text-slate-700"
                >
                  Current password
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  autoComplete="current-password"
                  {...registerPw("oldPassword", {
                    required: "Current password is required",
                  })}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-all duration-100 ease-out focus:border-transparent focus:ring-1 focus:ring-[#8132e5]"
                />
                {pwErrors.oldPassword && (
                  <span className="text-xs text-red-600">
                    {pwErrors.oldPassword.message}
                  </span>
                )}
              </div>

              {/* New password */}
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="newPassword"
                  className="text-[15px] text-slate-700"
                >
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...registerPw("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-all duration-100 ease-out focus:border-transparent focus:ring-1 focus:ring-[#8132e5]"
                />
                {pwErrors.newPassword && (
                  <span className="text-xs text-red-600">
                    {pwErrors.newPassword.message}
                  </span>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-[15px] text-slate-700"
                >
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...registerPw("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === watchPw("newPassword") ||
                      "Passwords do not match",
                  })}
                  className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none transition-all duration-100 ease-out focus:border-transparent focus:ring-1 focus:ring-[#8132e5]"
                />
                {pwErrors.confirmPassword && (
                  <span className="text-xs text-red-600">
                    {pwErrors.confirmPassword.message}
                  </span>
                )}
              </div>

              {/* Change password button */}
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={passwordChangedLoading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#8132e5] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#7024cf] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordChangedLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Updating…
                    </>
                  ) : (
                    "Change password"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Image preview modal ──────────────────────────────────────────── */}
      <ImagePreviewModal
        isOpen={modalOpen !== null}
        type={modalOpen}
        previewUrl={
          modalOpen === "avatar"
            ? pendingAvatar?.previewUrl
            : pendingCover?.previewUrl
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        loading={modalOpen === "avatar" ? avatarLoading : coverImageLoading}
      />
    </>
  );
}

export default EditChannel;
