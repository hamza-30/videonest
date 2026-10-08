import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "video_like",
        "comment_like",
        "tweet_like",
        "video_comment",
        "subscribe_channel",
      ],
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    parentTarget: {
      type: Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(mongooseAggregatePaginate);

notificationSchema.index(
  { recipient: 1, actor: 1, type: 1, target: 1 },
  { unique: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
