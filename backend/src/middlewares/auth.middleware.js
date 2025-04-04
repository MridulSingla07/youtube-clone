import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    next(new ApiError(401, "Unauthorized Request"));
  }

  const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedTokenInfo?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    next(new ApiError(401, "Invalid Access Token"));
  }

  req.user = user;

  console.log(req.user);
  next();
});

export const verifyVideoOwner = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId) {
    next(new ApiError(400, "VideoId missing."));
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    next(new ApiError(400, "Invalid VideoId."));
  }

  // find the video
  const video = await Video.findById(videoId);
  if (!video) {
    next(new ApiError(400, "No matching video found."));
  }

  // only owner can edit their video details
  // check if the user is the owner themself

  // const isOwner = video.owner.toString() === req.user._id.toString();
  // if (!isOwner) {
  //   next(new ApiError(401, "Only creators can edit / delete their videos."));
  // }

  if (!video.owner.equals(req.user._id)) {
    next(new ApiError(401, "Only creators can edit/delete their videos."));
  }

  req.video = video;

  console.log(req.video);
  next();
});
