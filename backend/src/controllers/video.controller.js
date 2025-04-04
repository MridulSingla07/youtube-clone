import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    title,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const videoList = await Video.aggregatePaginate(
    Video.aggregate([
      {
        $match: {
          isPublished: true,
          ...(title && { title: title }),
          ...(userId && { owner: new mongoose.Types.ObjectId(userId) }),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                fullname: 1,
                avatar: 1,
                coverimage: 1,
              },
            },
          ],
        },
      },
      {
        $sort: {
          [sortBy]: sortType === "desc" ? -1 : 1,
        },
      },
    ]),
    options
  );
  return res
    .status(200)
    .json(new ApiResponse(200, videoList, "All Published Videos Fetched"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId?.trim()) {
    throw new ApiError(400, "Missing Video ID");
  }
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video corresponding to given id returned.")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => !field || field?.trim() === "")) {
    throw new ApiError(400, "Title and Description are required.");
  }
  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and Thumbnail both are required.");
  }

  const videoUpload = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoUpload) {
    throw new ApiError(400, "Error in uploading the video !");
  }
  if (!thumbnailUpload) {
    throw new ApiError(400, "Error in uploading the thumbnail !");
  }

  const video = await Video.create({
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    title,
    description,
    duration: videoUpload.duration,
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(500, "Something went wrong !");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Uploaded Successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  const video = req?.video;

  video.title = title || video.title;
  video.description = description || video.description;

  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail?.url) {
      throw new ApiError(400, "Error while uploading thumbnail.");
    }

    video.thumbnail = thumbnail?.url || video.thumbnail;
  }

  const updatedVideo = await video.save();

  return res.status(200).json(new ApiResponse(200, updatedVideo, "done"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { _id } = req?.video;

  const deleteVideo = await Video.deleteOne({ _id });

  return res
    .status(200)
    .json(new ApiResponse(200, deleteVideo, "Video Deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const video = req.video;
  video.isPublished = !video.isPublished;

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish Status changed successfully"));
});

const addView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "VideoId missing.");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid VideoId.");
  }

  const addView = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, addView, "Views increased by 1."));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
  addView,
};
