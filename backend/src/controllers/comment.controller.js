import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const fetchAllComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { limit = 10, page = 2 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // const commentsList = await ;

  const totalCommentsCount = await Comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
    },
    { $count: "count" },
  ]);

  const count = totalCommentsCount.length > 0 ? totalCommentsCount[0].count : 0;

  const commentsList = await Comment.aggregatePaginate(
    Comment.aggregate([
      {
        $match: { video: new mongoose.Types.ObjectId(videoId) },
      },
      {
        $sort: {
          createdAt: -1,
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
                fullname: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          owner: 1,
        },
      },
    ]),
    options
  );
  commentsList.totalComments = count;

  return res
    .status(200)
    .json(new ApiResponse(200, commentsList, "All comments fetched."));
});

const addComment = asyncHandler(async (req, res) => {
  const currentUser = req.user._id;
  const { videoId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content cannot be empty");
  }

  const comment = await Comment.create({
    content,
    video: new mongoose.Types.ObjectId(videoId),
    owner: new mongoose.Types.ObjectId(currentUser),
  });

  return res.status(201).json(new ApiResponse(201, comment, "Comment Added"));
});

const editComment = asyncHandler(async (req, res) => {
  const currentUser = req.user._id;
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment cannot be empty.");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  if (!comment.owner.equals(currentUser)) {
    throw new ApiError(403, "Unauthorized to edit comment");
  }

  comment.content = content;

  await comment.save();

  return res
    .status(201)
    .json(new ApiResponse(201, { content }, "Comment Updated Successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
  const currentUser = req.user._id;
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (!comment.owner.equals(currentUser)) {
    throw new ApiError(403, "Unauthorized to delete comment");
  }

  const deletedComment = await Comment.deleteOne({ _id: commentId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedComment, "Comment Deleted Successfully.")
    );
});

export { fetchAllComments, addComment, editComment, deleteComment };
