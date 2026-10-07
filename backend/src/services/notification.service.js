import { Notification } from "../models/notification.model.js";

const connection = new Map();

const addConnection = (userId, res) => {
  const id = userId.toString();

  if (!connection.has(id)) {
    connection.set(id, new Set());
  }
  connection.get(id).add(res);

  console.log("stream connected:", connection.get(id).size);
};

const removeConnection = (userId, res) => {
  const id = userId.toString();

  let set = connection.get(id);

  if (!set) return;

  set.delete(res);
  if (set.size == 0) {
    connection.delete(id);
  }

  console.log("stream disconnected", id, connection.get(id)?.size ?? 0);
};

const pushToUser = (userId, notification) => {
  const set = connection.get(userId.toString());

  if (!set) {
    return;
  }

  for (const res of set) {
    res.write(`id: ${notification._id}\n`);
    res.write(`event: notification\n`);
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  }
};

const createNotification = async ({
  recipientId,
  actorId,
  type,
  targetId,
  parentTargetId = null,
}) => {
  try {
    if (!recipientId || !actorId || !type || !targetId) return;
    if (recipientId.toString() === actorId.toString()) return;

    const result = await Notification.updateOne(
      {
        recipient: recipientId,
        actor: actorId,
        type: type,
        target: targetId,
      },
      {
        $setOnInsert: {
          isRead: false,
          ...(parentTargetId && { parentTarget: parentTargetId }),
        },
      },
      {
        upsert: true,
      }
    );

    if (!result.upsertedId) {
      return;
    }

    const [payload] = await Notification.aggregate(
      buildNotificationPipeline({
        _id: result.upsertedId,
      })
    );

    if (payload) {
      pushToUser(recipientId, payload);
    }
  } catch (error) {
    if (error.code !== 11000) {
      console.log(error);
    }
  }
};

const deleteNotification = async ({ recipientId, actorId, type, targetId }) => {
  try {
    if (!recipientId || !actorId || !type || !targetId) return;
    if (recipientId.toString() === actorId.toString()) return;

    const result = await Notification.deleteOne({
      recipient: recipientId,
      actor: actorId,
      type: type,
      target: targetId,
      isRead: false,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteNotificationsByTarget = async (targetId) => {
  try {
    if (!targetId) return;

    await Notification.deleteMany({
      $or: [{ target: targetId }, { parentTarget: targetId }],
    });
  } catch (error) {
    console.log(error);
  }
};

const buildNotificationPipeline = (match) => {
  return [
    {
      $match: match,
    },
    {
      $sort: { _id: -1 },
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
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$actor", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "videos",
        localField: "target",
        foreignField: "_id",
        as: "videoTarget",
        pipeline: [
          {
            $project: {
              title: 1,
              thumbnail: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "target",
        foreignField: "_id",
        as: "commentTarget",
        pipeline: [
          {
            $project: {
              content: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "target",
        foreignField: "_id",
        as: "tweetTarget",
        pipeline: [
          {
            $project: {
              content: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "parentTarget",
        foreignField: "_id",
        as: "parentVideo",
        pipeline: [
          {
            $project: {
              title: 1,
              thumbnail: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        targetDetails: {
          $arrayElemAt: [
            {
              $concatArrays: ["$videoTarget", "$commentTarget", "$tweetTarget"],
            },
            0,
          ],
        },
        parentVideo: { $arrayElemAt: ["$parentVideo", 0] },
      },
    },

    {
      $project: {
        videoTarget: 0,
        commentTarget: 0,
        tweetTarget: 0,
      },
    },
  ];
};

export {
  addConnection,
  removeConnection,
  createNotification,
  deleteNotification,
  deleteNotificationsByTarget,
  buildNotificationPipeline,
};
