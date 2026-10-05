import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Notification } from "../models/notification.model.js";

const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const notificationsAggregate = Notification.aggregate([
    {
      $match: { recipient: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "actor",
        foreignField: "_id",
        as: "actor",
        pipeline: [
          {
            $project: {
              avatar: 1,
              fullName: 1,
              username: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$actor", preserveNullAndEmptyArrays: true } },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const notifications = await Notification.aggregatePaginate(
    notificationsAggregate,
    options
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});

const getUnreadNotificationsCount = asyncHandler(async (req, res) => {
  const unreadNotificationsCount = await Notification.countDocuments({
    recipient: new mongoose.Types.ObjectId(req.user._id),
    isRead: false,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: unreadNotificationsCount },
        "Count of unread notifications fetched successfully"
      )
    );
});

const readNotifications = asyncHandler(async (req, res) => {
  const { upToId } = req.body;

  if (!upToId || !isValidObjectId(upToId)) {
    throw new ApiError(400, "Invalid Notification ID");
  }

  const result = await Notification.updateMany(
    {
      recipient: req.user._id,
      isRead: false,
      _id: { $lte: upToId },
    },
    {
      $set: { isRead: true },
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { modifiedCount: result.modifiedCount },
        "Notifications read successfully"
      )
    );
});

export { getUserNotifications, getUnreadNotificationsCount, readNotifications };
