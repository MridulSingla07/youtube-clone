import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  showLikeCount,
  toggleLike,
} from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.route("/get-like-count").get(showLikeCount);

// passing videoId or commentId as query params
likeRouter.route("/toggle-like").patch(verifyJWT, toggleLike);
likeRouter.route("/liked-videos").get(verifyJWT, getLikedVideos);

export default likeRouter;
