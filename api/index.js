import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing_route.js";
import cookieParser from "cookie-parser";
import path from "path";

// Loading environment variables from the .env file
dotenv.config();

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();

// Adding middleware to parse JSON in requests
app.use(express.json());

// Adding middleware to parse cookies in requests
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});


// Routing for user-related API endpoints
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Serving static files from the 'client/dist' directory
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})


// Error handling middleware
app.use((err, req, res, next) => {
  // Extracting status code and message from the error object
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
