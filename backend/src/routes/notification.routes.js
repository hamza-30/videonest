import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUnreadNotificationsCount,
  getUserNotifications,
  readNotifications,
} from "../controllers/notification.controller.js";

const router = new Router();

router.use(verifyJWT);

router.route("/").get(getUserNotifications);
router.route("/unread-count").get(getUnreadNotificationsCount);
router.route("/read").patch(readNotifications);

export default router;
