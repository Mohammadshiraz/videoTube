import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userRegister = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, fullName, email, password } = req.body;

  // validation - not empty
  if (!username || !fullName || !email || !password) {
    throw new ApiError(400, "all fields are requires");
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "user already exist");
  }

  // check for images, check for avatar
  const avatarLocalFile = req.files?.avatar[0]?.path;
  const coverImageLocalFile = req.files?.coverImage[0]?.path;

  if (!avatarLocalFile) {
    throw new ApiError(400, "avatar file is required");
  }

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalFile);
  const coverImage = await uploadOnCloudinary(coverImageLocalFile);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }
  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,

    username: username.toLowerCase(),
  });
  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }
  // return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});
export { userRegister };
