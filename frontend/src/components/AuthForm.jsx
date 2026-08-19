import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AuthForm({ mode }) {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    resetField,
    watch,
    formState: { errors },
  } = useForm();
  const avatarFile = watch("avatar")?.[0];
  const coverImageFile = watch("coverImage")?.[0];

  const { login, signup, loading, error } = useAuth();

  const submit = async (data) => {
    if (isLogin) {
      const { loginIdentifier, password } = data;
      let isEmail = false;
      let email = "";
      let username = "";

      if (loginIdentifier.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
        isEmail = true;
      }

      if (isEmail) {
        email = loginIdentifier;
        await login({ email, password });
      } else {
        username = loginIdentifier;
        await login({ username, password });
      }
    } else {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      await signup(formData);
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl h-fit w-full max-w-96 px-6.5 py-3.5`}
    >
      <h2 className={`text-lg text-center font-medium mb-5`}>
        {isLogin ? "Log In" : "Sign Up"}
      </h2>
      <form className={`flex flex-col gap-y-3`} onSubmit={handleSubmit(submit)}>
        {isLogin ? (
          <div className="flex flex-col">
            <label htmlFor="loginIdentifier" className="text-[15px]">
              Email or username
            </label>
            <input
              {...register("loginIdentifier", {
                required: "Email or username is required",
              })}
              className="h-10 px-2 rounded-lg outline-none border border-gray-200 focus:border-transparent focus:ring-1 focus:ring-[#8132e5] transition-all ease-out duration-100"
              id="loginIdentifier"
              autoComplete="username"
            />
            {errors.loginIdentifier && (
              <span className="mt-1 text-xs text-red-600">
                {errors.loginIdentifier.message}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className={`flex flex-col`}>
              <label htmlFor="fullName" className={`text-[15px]`}>
                Full name
              </label>
              <input
                {...register("fullName", { required: true })}
                className={`h-10 px-2 rounded-lg outline-none border border-gray-200 focus:border-none focus:ring-1 focus:ring-[#8132e5] transition-all ease-out duration-100`}
                id="fullName"
              />
              {errors.fullName && (
                <span className="mt-1 text-xs text-red-600">
                  Full name is required
                </span>
              )}
            </div>
            <div className={`flex flex-col`}>
              <label htmlFor="username" className={`text-[15px]`}>
                Username
              </label>
              <input
                {...register("username", { required: true })}
                className={`h-10 px-2 rounded-lg outline-none border border-gray-200 focus:border-none focus:ring-1 focus:ring-[#8132e5] transition-all ease-out duration-100`}
                id="username"
              />
              {errors.username && (
                <span className="mt-1 text-xs text-red-600">
                  Username is required
                </span>
              )}
            </div>
            <div className={`flex flex-col`}>
              <label htmlFor="email" className={`text-[15px]`}>
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="h-10 px-2 rounded-lg outline-none border border-gray-200 focus:border-transparent focus:ring-1 focus:ring-[#8132e5] transition-all ease-out duration-100"
                id="email"
                type="email"
              />
              {errors.email && (
                <span className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>
          </>
        )}
        <div className={`flex flex-col`}>
          <label htmlFor="password" className={`text-[15px]`}>
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", { required: "Password is required" })}
              className={`h-10 w-full px-2 pr-9 rounded-lg outline-none border border-gray-200 focus:border-none focus:ring-1 focus:ring-[#8132e5] transition-all ease-out duration-100`}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
          {errors.password && (
            <span className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </span>
          )}
        </div>
        {!isLogin && (
          <div className={`flex flex-col`}>
            <label htmlFor="confirmPassword" className={`text-[15px]`}>
              Confirm password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className={`h-10 w-full px-2 pr-9 rounded-lg outline-none border border-gray-200 focus:border-none focus:ring-1 focus:ring-[#8132e5] transition-all ease-out duration-100`}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        )}

        {!isLogin && (
          <div className="flex flex-col">
            <label htmlFor="avatar" className="text-[15px]">
              Profile
            </label>
            <input
              {...register("avatar", {
                required: "Avatar is required",
              })}
              className="w-full text-sm file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-sm"
              id="avatar"
              type="file"
              accept="image/*"
            />
            {avatarFile && (
              <div className="mt-1 flex items-center justify-between gap-2 text-sm text-gray-600">
                <span className="truncate" title={avatarFile.name}>
                  {avatarFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => resetField("avatar")}
                  className="shrink-0 text-gray-500 hover:text-red-600 cursor-pointer"
                  aria-label={`Remove ${avatarFile.name}`}
                  title="Remove file"
                >
                  <IoCloseOutline size={18} />
                </button>
              </div>
            )}
            {errors.avatar && (
              <span className="mt-1 text-xs text-red-600">
                {errors.avatar.message}
              </span>
            )}
          </div>
        )}
        {!isLogin && (
          <div className="flex flex-col">
            <label htmlFor="coverImage" className="text-[15px]">
              Cover image (opt.)
            </label>
            <input
              {...register("coverImage")}
              className="w-full text-sm file:mr-2 file:rounded-md file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-sm"
              id="coverImage"
              type="file"
              accept="image/*"
            />
            {coverImageFile && (
              <div className="mt-1 flex items-center justify-between gap-2 text-sm text-gray-600">
                <span className="truncate" title={coverImageFile.name}>
                  {coverImageFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => resetField("coverImage")}
                  className="shrink-0 text-gray-500 hover:text-red-600 cursor-pointer"
                  aria-label={`Remove ${coverImageFile.name}`}
                  title="Remove file"
                >
                  <IoCloseOutline size={18} />
                </button>
              </div>
            )}
            {errors.coverImage && (
              <span className="mt-1 text-xs text-red-600">
                {errors.coverImage.message}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`bg-[#8132e5] hover:bg-[#8032e5dd] active:bg-[#8032e5dd] text-white h-10 rounded-lg mt-2 cursor-pointer flex items-center justify-center disabled:pointer-events-none`}
        >
          {loading ? (
            <div
              className={`border-2 border-white border-t-transparent rounded-full h-5 w-5 animate-spin text-center`}
            ></div>
          ) : isLogin ? (
            "Log In"
          ) : (
            "Create Account"
          )}
        </button>

        {isLogin ? (
          <div className={`text-sm mb-1`}>
            <span className={`text-gray-500`}>Don't have an account?</span>
            <Link
              to={"/signup"}
              className={`ml-1.5 text-[#8132e5] hover:underline active:underline`}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className={`text-sm mb-1`}>
            <span className={`text-gray-500`}>Already have an account?</span>
            <Link
              to={"/login"}
              className={`ml-1.5 text-[#8132e5] hover:underline active:underline`}
            >
              Log In
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default AuthForm;
