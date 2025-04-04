import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { _id } = req.user;

  if (!channelId) {
    throw new ApiError(404, "ChannelId not provided.");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: _id,
    channel: channelId,
  });

  if (!existingSubscription) {
    const newSubscription = await Subscription.create({
      subscriber: _id,
      channel: channelId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newSubscription, "Subscribed Successfully."));
  }

  const deletedSub = await Subscription.findByIdAndDelete(
    existingSubscription._id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedSub, "Subscription Removed Successfully.")
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const subscribersList = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $project: {
        subscriber: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
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
        subscriber: {
          $first: "$subscriber",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$subscriber",
      },
    },
  ]);

  const count = subscribersList.length;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriber: subscribersList, count: count },
        "List of all Subscribers."
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const channelList = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $project: {
        channel: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
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
        channel: {
          $first: "$channel",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$channel",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelList,
        "List of all channels subscribed to returned."
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
