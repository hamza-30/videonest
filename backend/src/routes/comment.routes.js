import { Router } from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { commentLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(verifyJWT); //applies verifyJWT to all defined routes

router
  .route("/:videoId")
  .get(getVideoComments)
  .post(commentLimiter, addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
