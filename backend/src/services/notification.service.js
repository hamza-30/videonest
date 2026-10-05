import { Notification } from "../models/notification.model.js";

export const createNotification = async ({
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
        ...(parentTargetId && { parentTarget: parentTargetId }),
      },
      {
        $setOnInsert: {
          isRead: false,
        },
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    if (error.code !== 11000) {
      console.log(error);
    }
  }
};

export const deleteNotification = async ({
  recipientId,
  actorId,
  type,
  targetId,
}) => {
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
