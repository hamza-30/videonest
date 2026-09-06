import { useState } from "react";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import { userService } from "../services/userService";
import toast from "react-hot-toast";

function useUser() {
  const { user, setUser } = useAuthContext();
  const [channelEditLoading, setChannelEditLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [passwordChangedLoading, setPasswordChangedLoading] = useState(false);

  const updateChannelDetails = async ({
    fullName = user?.fullName,
    email = user?.email,
  } = {}) => {
    setChannelEditLoading(true);
    try {
      const response = await userService.updateAccountDetails({
        fullName,
        email,
      });
      setUser(response.data);
      toast.success("User details updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update user details");
    } finally {
      setChannelEditLoading(false);
    }
  };

  const updateUserAvatar = async (formData) => {
    setAvatarLoading(true);
    try {
      const response = await userService.updateAvatar(formData);
      setUser(response.data);
      toast.success("User avatar updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update avatar");
    } finally {
      setAvatarLoading(false);
    }
  };

  const updateUserCoverImage = async (formData) => {
    setCoverImageLoading(true);
    try {
      const response = await userService.updateCoverImage(formData);
      setUser(response.data);
      toast.success("User cover image updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update cover image");
    } finally {
      setCoverImageLoading(false);
    }
  };

  const changeUserPassword = async (data) => {
    setPasswordChangedLoading(true);
    try {
      const response = await userService.changePassword(data);
      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setPasswordChangedLoading(false);
    }
  };

  return {
    updateChannelDetails,
    updateUserAvatar,
    updateUserCoverImage,
    changeUserPassword,
    channelEditLoading,
    avatarLoading,
    coverImageLoading,
    passwordChangedLoading,
  };
}

export default useUser;
