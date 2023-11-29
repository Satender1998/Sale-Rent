import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Signup route controller
export const signup = async (req, res, next) => {
  // Extracting user information from the request body
  const { username, email, password } = req.body;
  // Hashing the password using bcryptjs
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    // Creating a new User instance and saving it to the database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Creating response data with user details
    const responseData = {
      message: "User created successfully!",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    };

    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

// Signin route controller
export const signin = async (req, res, next) => {
  // Extracting email and password from the request body
  const { email, password } = req.body;

  try {
    // Finding a user with the provided email in the database
    const validUser = await User.findOne({ email });

    // Handling case where the user is not found

    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    // Comparing the provided password with the stored hashed password
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    // Handling case where the password is invalid
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials!"));
    }

    // Generating a JWT token for the authenticated user
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Extracting user details (excluding password) for the response
    const { password: pass, ...rest } = validUser._doc;

    // Sending a success response with the user details and setting a cookie with the token
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google OAuth route controller
export const google = async (req, res, next) => {
  try {
    // Checking if a user with the provided email already exists
    const existingUser = await User.findOne({ email: req.body.email });

    // Handling case where the user already exists
    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = existingUser._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }

    // Generating a random password for the new user
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    // Hashing the generated password
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    // Creating a new User instance with Google OAuth details and saving it to the database
    const newUser = new User({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });

    await newUser.save();

    // Generating a JWT token for the newly created user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Signout route controller
export const signOut = (req, res, next) => {
  try {
    // Clearing the access_token cookie on signout
    res.clearCookie("access_token");
    // Sending a success response
    res.status(200).json({ message: "User has been logged out" });
  } catch (error) {
    // Handling errors and passing them to the next middleware
    next(error);
  }
};
