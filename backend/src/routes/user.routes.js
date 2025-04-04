import { Router } from "express";
import {
  addToWatchHistory,
  changeCurrentPassword,
  fetchCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/channel/:username").get(getUserChannelProfile);

// secured routes
userRouter.use(verifyJWT);

userRouter.route("/logout").post(logoutUser);
userRouter.route("/refresh-tokens").post(refreshAccessToken);
userRouter.route("/change-password").post(changeCurrentPassword);
userRouter.route("/current-user").get(fetchCurrentUser);
userRouter.route("/update-profile").patch(updateUserProfile);
userRouter
  .route("/update-avatar")
  .patch(upload.single("avatar"), updateUserAvatar);

userRouter.route("/watchHistory").get(getWatchHistory);
userRouter.route("/watch-video/:videoId").post(addToWatchHistory);

export default userRouter;
