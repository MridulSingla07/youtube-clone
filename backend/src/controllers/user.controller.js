import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Couldn't generate Access or Refresh Token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend -> convert username to lowercase
  // validation - (not empty)
  // check if user already exists : username and email
  // check for images and avatar
  // upload them to cloudinary, check avatar

  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { fullname, email, password } = req.body;

  let { username } = req.body;

  username = username.toLowerCase();

  if (
    [fullname, username, email, password].some(
      (field) => !field || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Invalid Input");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with this username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath =
    req.files?.coverimage[0]?.path || "./public/temp/default.png";

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Image is required !");
  }
  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);

  const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarUpload) {
    throw new ApiError(400, "Error in uploading the image !");
  }

  const user = await User.create({
    fullname,
    avatar: avatarUpload.url,
    coverimage: coverImageUpload?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong !");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // username or email
  // find the user
  // if user -> check password
  // if password correct -> access and refresh token
  // send cookies

  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Username or email is required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }],
  });

  if (!existingUser) {
    throw new ApiError(404, "User doesn't exists");
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password doesn't match");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    existingUser._id
  );

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // access refresh token from cookies
  // if no token -> throw unauthorized access error
  // verify using jwt
  //

  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }
  const decodedRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedRefreshToken?._id);
  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh Token doesn't match");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const passwordCorrectStatus = await user.isPasswordCorrect(oldPassword);
  if (!passwordCorrectStatus) {
    throw new ApiError(400, "Current Password doesn't match !");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const fetchCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname && !email) {
    throw new ApiError(400, "New Fullname and Email required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "User data updated"));
});

const updateUserAvatar = asyncHandler(async (res, req) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Image is Missing");
  }

  const response = await uploadOnCloudinary(avatarLocalPath);

  if (!response?.url) {
    throw new ApiError(400, "Error while uploading Avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: response.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image Updated Successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // getting user channel name from params

  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        coverimage: 1,
        avatar: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel doesn't exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fecthed successfully")
    );
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { watchHistory: new mongoose.Types.ObjectId(videoId) },
  });

  const addVideo = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { watchHistory: new mongoose.Types.ObjectId(videoId) },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { count: addVideo.watchHistory.length },
        "Video added to watch history."
      )
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $project: {
        username: 1,
        email: 1,
        fullname: 1,
        watchHistory: 1,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
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
    .json(new ApiResponse(200, user, "Watch History Fetched Successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  fetchCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
  addToWatchHistory,
};
