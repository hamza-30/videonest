import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected) {
    return res
      .status(503)
      .json(
        new ApiResponse(503, { status: "error" }, "Database connection lost")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { status: "ok" }, "Server and DB are ok"));
});

export { healthcheck };
