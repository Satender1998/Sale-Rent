import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Api route is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

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

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const deleteUser = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: paramsId } = req.params;

  if (userId !== paramsId) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }

  try {
    await User.findByIdAndDelete(paramsId);
    res.clearCookie("access_token").status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};


export const getUserListings = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: paramsId } = req.params;

  if (userId !== paramsId) {
    return next(errorHandler(401, "You can only view your own listings!"));
  }

  try {
    const listings = await Listing.find({ userRef: paramsId });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};



export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
