import { Router } from "express";
import {
  addView,
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideoDetails,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyVideoOwner } from "../middlewares/auth.middleware.js";

const videoRouter = Router();

// unprotected route (not logged in users should also see videos)
videoRouter.route("/").get(getAllVideos);
videoRouter.route("/:videoId").get(getVideoById);
videoRouter.route("/add-view/:videoId").patch(addView);

// secure routes
videoRouter.use(verifyJWT);

videoRouter.route("/upload-video").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

videoRouter
  .route("/update-video-details/:videoId")
  .patch(verifyVideoOwner, upload.single("thumbnail"), updateVideoDetails);

videoRouter
  .route("/delete-video/:videoId")
  .delete(verifyVideoOwner, deleteVideo);

videoRouter
  .route("/toggle-publish/:videoId")
  .patch(verifyVideoOwner, togglePublishStatus);

export default videoRouter;
