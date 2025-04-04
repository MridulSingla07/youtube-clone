import { Router } from "express";
import {
  addComment,
  deleteComment,
  editComment,
  fetchAllComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.route("/get-all-comments/:videoId").get(fetchAllComments);
commentRouter.route("/add-comment/:videoId").post(verifyJWT, addComment);
commentRouter.route("/edit-comment/:commentId").patch(verifyJWT, editComment);
commentRouter
  .route("/delete-comment/:commentId")
  .delete(verifyJWT, deleteComment);

export default commentRouter;
