import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const pipeline = [];

  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid User ID");
    }
    pipeline.push({
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    });
  }

  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push({
    $match: { isPublished: true },
  });

  const sortStage = {};
  sortStage[sortBy] = parseInt(sortType);
  pipeline.push({ $sort: sortStage });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
      pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
    },
  });

  pipeline.push({ $unwind: "$owner" });

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title) {
    throw new ApiError(400, "Video title is required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail?.url || "",
    title: title,
    description: description || "",
    duration: videoFile.duration,
    isPublished: true,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const video = await Video.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner._id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$videoLikes" },
        isLiked: {
          $in: [req.user._id, "$videoLikes.likedBy"],
        },
        subscribersCount: { $size: "$subscribers" },
        isSubscribed: {
          $in: [req.user._id, "$subscribers.subscriber"],
        },
      },
    },

    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        likesCount: 1,
        isLiked: 1,
        subscribersCount: 1,
        isSubscribed: 1,
        createdAt: 1,
        "owner._id": 1,
        "owner.fullName": 1,
        "owner.username": 1,
        "owner.avatar": 1,
      },
    },
  ]);

  if (!video?.length) {
    throw new ApiError(404, "Video not found");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.watchHistory = [
      video[0]._id,
      ...user.watchHistory.filter((id) => !id.equals(video[0]._id)),
    ];
    await user.save({ validateBeforeSave: false });
  }

  if (!video[0].owner._id.equals(req.user._id)) {
    await Video.findByIdAndUpdate(video[0]._id, {
      $inc: {
        views: 1,
      },
    });

    video[0].views += 1;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  let thumbnail;
  if (thumbnailLocalPath) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail) {
      throw new ApiError(500, "Failed to fetch new thumbnail");
    }
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are forbidden to update the video");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title || video.title,
        description: description || video.description,
        thumbnail: thumbnail?.url || video.thumbnail,
      },
    },
    {
      returnDocument: "after",
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are forbidden to update the video");
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  if (!deletedVideo) {
    throw new ApiError(500, "Failed to delete video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(
      403,
      "You are forbidden to update the publish status of this video"
    );
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Publish status changed successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
