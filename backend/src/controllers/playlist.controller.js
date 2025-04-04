import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if ([name, description].some((field) => !field || field?.trim === "")) {
    throw new ApiError(400, "Name and Description cannot be empty.");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "Error while creating the playlist.");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, playlist, "Playlist created successfully."));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id.");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "No matching playlist found.");
  }

  // only the owner can add videos to their playlist
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized to add video to this playlist.");
  }

  const addVideos = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: new mongoose.Types.ObjectId(videoId),
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { count: addVideos.videos.length }, "playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id.");
  }
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id.");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "No matching playlist found.");
  }

  // only the owner can delete videos from their playlist
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete video from this playlist.");
  }

  const deleteVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: { videos: new mongoose.Types.ObjectId(videoId) },
    },
    { new: true }
  );

  return res
    .status(203)
    .json(
      new ApiResponse(
        203,
        { count: deleteVideo.videos.length },
        "Video deleted from playlist."
      )
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const allPlaylists = await Playlist.aggregate([
    {
      $match: {
        owner: req.user._id,
      },
    },
    {
      $addFields: {
        totalVideos: {
          $size: "$videos",
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        totalVideos: 1,
        videos: {
          $slice: ["$videos", 1],
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              _id: 0,
              thumbnail: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        videos: {
          $first: "$videos.thumbnail",
        },
      },
    },
  ]);
  // videos field contains the thumbnail of the first video of the playlist for the playlist thumbnail

  return res
    .status(200)
    .json(new ApiResponse(200, allPlaylists, "Fetched all playlists."));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              thumbnail: 1,
              title: 1,
              duration: 1,
              owner: 1,
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
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist data fetched."));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const isPlaylist = await Playlist.findById(playlistId);
  if (!isPlaylist) {
    throw new ApiError(404, "No matching playlist found.");
  }

  if (!isPlaylist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized to delete playlist.");
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(203)
    .json(new ApiResponse(203, playlist, "Playlist deleted successfully."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if ([name, description].some((field) => !field || field?.trim() === "")) {
    throw new ApiError(400, "Invalid name or description");
  }

  const isPlaylist = await Playlist.findById(playlistId);
  if (!isPlaylist) {
    throw new ApiError(404, "No matching playlist found.");
  }

  if (!isPlaylist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Unauthorized to update playlist.");
  }

  const updatePlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: { name, description },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatePlaylist,
        "Playlist details updated successfully."
      )
    );
});

export {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getUserPlaylists,
  getPlaylistById,
  deletePlaylist,
  updatePlaylist,
};
