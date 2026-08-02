import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const subscribers = await Subscription.countDocuments({
    channel: req.user._id,
  });

  const statsResult = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalVideoViews: { $sum: "$views" },
      },
    },
  ]);

  const stats = statsResult[0] || {
    totalVideos: 0,
    totalVideoViews: 0,
  };

  const likesResult = await Like.aggregate([
    {
      $match: {
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $match: { "video.owner": new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $count: "totalLikes",
    },
  ]);

  const totalLikes = likesResult[0]?.totalLikes || 0;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribers, ...stats, totalLikes },
        "Channel stats fetched successfully"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const publishedVideos = await Video.find({
    isPublished: true,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, publishedVideos, "User videos fetched successfully")
    );
});

export { getChannelStats, getChannelVideos };
