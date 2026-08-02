import { Router } from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); //applies verifyJWT to all defined routes

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
