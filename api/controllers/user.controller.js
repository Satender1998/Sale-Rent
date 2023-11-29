import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Api route is working",
  });
};


// Controller to update user details
export const updateUser = async (req, res, next) => {
  // Checking if the authenticated user is updating their own account
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    // Hashing the password if it is included in the request body
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Updating the user details in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    
    // Extracting user details (excluding password) for the response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



// Controller to delete a user account
export const deleteUser = async (req, res, next) => {
  // Extracting user IDs from the request parameters and authentication
  const { id: userId } = req.user;
  const { id: paramsId } = req.params;

  // Checking if the authenticated user is deleting their own account
  if (userId !== paramsId) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }

  try {
    // Deleting the user from the database and clearing the access_token cookie
    await User.findByIdAndDelete(paramsId);
    res.clearCookie("access_token").status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};


// Controller to get listings associated with a specific user
export const getUserListings = async (req, res, next) => {
  // Extracting user IDs from the request parameters and authentication
  const { id: userId } = req.user;
  const { id: paramsId } = req.params;


  // Checking if the authenticated user is accessing their own listings
  if (userId !== paramsId) {
    return next(errorHandler(401, "You can only view your own listings!"));
  }

  try {
     // Finding listings associated with the specified user
    const listings = await Listing.find({ userRef: paramsId });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};


// Controller to get user details by ID
export const getUser = async (req, res, next) => {
  try {
     // Finding the user by their ID
    const user = await User.findById(req.params.id);

      // Handling case where the user is not found
    if (!user) return next(errorHandler(404, "User not found!"));

    // Extracting user details (excluding password) for the response
    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
