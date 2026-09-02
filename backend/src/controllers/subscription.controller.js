import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (req.user._id.equals(channelId)) {
    throw new ApiError(403, "You are forbidden to subscribe your own channel");
  }

  const subscribed = await Subscription.findOne({
    subscriber: new mongoose.Types.ObjectId(req.user?._id),
    channel: channelId,
  });

  if (!subscribed) {
    const channelSubscribed = await Subscription.create({
      subscriber: new mongoose.Types.ObjectId(req.user?._id),
      channel: channelId,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          channelSubscribed,
          "Subscribed to channel successfully"
        )
      );
  }

  const deleteSubscription = await Subscription.findOneAndDelete(
    subscribed._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deleteSubscription,
        "Unsubscribed the channel successfully"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },
    {
      $unwind: "$subscriber",
    },
    {
      $project: {
        _id: "$subscriber._id",
        fullName: "$subscriber.fullName",
        username: "$subscriber.username",
        avatar: "$subscriber.avatar",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "List of subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const channels = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
      },
    },
    {
      $unwind: "$channel",
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "channel._id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $project: {
        _id: "$channel._id",
        fullName: "$channel.fullName",
        username: "$channel.username",
        avatar: "$channel.avatar",
        subscribersCount: {
          $size: "$subscribers",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "List of channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
