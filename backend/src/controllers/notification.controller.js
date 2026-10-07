import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Notification } from "../models/notification.model.js";
import {
  addConnection,
  buildNotificationPipeline,
  removeConnection,
} from "../services/notification.service.js";

const activeEventStream = (req, res) => {
  const userId = req.user._id;

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  res.flushHeaders();
  addConnection(userId, res);

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeConnection(userId, res);
  });
};

const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const notificationsAggregate = Notification.aggregate(
    buildNotificationPipeline({
      recipient: new mongoose.Types.ObjectId(req.user._id),
    })
  );

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

export {
  activeEventStream,
  getUserNotifications,
  getUnreadNotificationsCount,
  readNotifications,
};
