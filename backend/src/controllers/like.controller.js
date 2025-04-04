import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async (req, res) => {
  const currentUser = req.user._id;
  const { videoId, commentId } = req.query;

  if (!videoId && !commentId) {
    throw new ApiError(400, "Invalid Request");
  }
  if (videoId && commentId) {
    throw new ApiError(400, "Invalid Request");
  }

  const filter = videoId
    ? { video: new mongoose.Types.ObjectId(videoId), likedBy: currentUser }
    : { comment: new mongoose.Types.ObjectId(commentId), likedBy: currentUser };

  const isLiked = await Like.findOne(filter);
  if (isLiked) {
    const removeLike = await Like.findByIdAndDelete(isLiked._id);
    return res
      .status(200)
      .json(new ApiResponse(200, removeLike, "Like removed."));
  } else {
    const addLike = await Like.create(filter);
    return res.status(201).json(new ApiResponse(201, addLike, "Video Liked."));
  }
});

const showLikeCount = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.query;

  if (!videoId && !commentId) {
    throw new ApiError(400, "Invalid Request");
  }
  if (videoId && commentId) {
    throw new ApiError(400, "Invalid Request");
  }

  const filter = videoId
    ? { video: new mongoose.Types.ObjectId(videoId) }
    : { comment: new mongoose.Types.ObjectId(commentId) };

  const likesCount = await Like.aggregate([
    {
      $match: filter,
    },
    {
      $count: "totalLikes",
    },
  ]);

  const count = likesCount.length > 0 ? likesCount[0].totalLikes : 0;

  return res
    .status(200)
    .json(new ApiResponse(200, { count }, "Likes Count Returned"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const currentUser = req.user._id;

  const allLikedVideos = await Like.aggregate([
    {
      $match: { likedBy: currentUser },
    },
    {
      $project: {
        video: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $project: {
              _id: 1,
              thumbnail: 1,
              title: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        video: {
          $first: "$video",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "video.owner",
        as: "video.owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        "video.owner": { $first: "$video.owner" }, // Flatten owner array
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, allLikedVideos, "Liked videos fetched."));
});

export { toggleLike, showLikeCount, getLikedVideos };
