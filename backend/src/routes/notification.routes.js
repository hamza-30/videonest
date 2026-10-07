import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUnreadNotificationsCount,
  getUserNotifications,
  readNotifications,
  streamNotifications,
} from "../controllers/notification.controller.js";

const router = new Router();

router.use(verifyJWT);

router.route("/").get(getUserNotifications);
router.route("/unread-count").get(getUnreadNotificationsCount);
router.route("/read").patch(readNotifications);
router.route("/stream").get(streamNotifications);

export default router;
