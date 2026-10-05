import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createNotification,
  deleteNotification,
} from "../services/notification.service.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const deletedLike = await Like.findOneAndDelete({
    video: videoId,
    likedBy: req.user._id,
  });

  if (deletedLike) {
    await deleteNotification({
      recipientId: video.owner,
      actorId: req.user._id,
      type: "video_like",
      targetId: videoId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
      );
  }

  const like = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  await createNotification({
    recipientId: video.owner,
    actorId: req.user._id,
    type: "video_like",
    targetId: videoId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: true }, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const deletedLike = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (deletedLike) {
    await deleteNotification({
      recipientId: comment.owner,
      actorId: req.user._id,
      type: "comment_like",
      targetId: commentId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Comment unliked successfully")
      );
  }

  const like = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  await createNotification({
    recipientId: comment.owner,
    actorId: req.user._id,
    type: "comment_like",
    targetId: commentId,
    parentTargetId: comment.video,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked: true }, "Comment liked successfully")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const deletedLike = await Like.findOneAndDelete({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (deletedLike) {
    await deleteNotification({
      recipientId: tweet.owner,
      actorId: req.user._id,
      type: "tweet_like",
      targetId: tweetId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully")
      );
  }

  const like = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  await createNotification({
    recipientId: tweet.owner,
    actorId: req.user._id,
    type: "tweet_like",
    targetId: tweetId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: true }, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
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
            $project: {
              thumbnail: 1,
              title: 1,
              description: 1,
              duration: 1,
              views: 1,
              isPublished: 1,
              createdAt: 1,
              "owner.fullName": 1,
              "owner.username": 1,
              "owner.avatar": 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$video",
    },
    {
      $project: {
        comment: 0,
        tweet: 0,
        likedBy: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
